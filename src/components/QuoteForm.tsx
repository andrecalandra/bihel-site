import { useState, type FormEvent } from "react";
import { track } from "../analytics";
import { sendLead } from "../lead";
import { asset } from "../asset";

type Status = "idle" | "redirecting";

/** Monta a mensagem e abre o WhatsApp já preenchido sem back-end envolvido. */
function buildWhatsAppUrl(whatsappNumber: string, data: FormData) {
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const service = String(data.get("service") || "").trim();
  const message = String(data.get("message") || "").trim();

  const lines = [
    `Olá! Me chamo ${name} e gostaria de solicitar um orçamento.`,
    service && `Serviço de interesse: ${service}`,
    phone && `Meu telefone: ${phone}`,
    email && `Meu e-mail: ${email}`,
    message && `Mensagem: ${message}`,
  ].filter(Boolean);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function QuoteForm({
  whatsappNumber,
  serviceOptions,
}: {
  whatsappNumber: string;
  serviceOptions: string[];
}) {
  // `window` não existe durante a pré-renderização no build (Node).
  const preselected =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("service")
      : null;
  const initialService = preselected && serviceOptions.includes(preselected)
    ? preselected
    : "Outro / não sei ainda";

  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("redirecting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const service = String(formData.get("service") || "");
    track("form_submit", service);
    track("whatsapp_click", "Formulário de orçamento", service);
    const url = buildWhatsAppUrl(whatsappNumber, formData);

    // o WhatsApp abre primeiro (precisa ser direto do clique); o registro no painel vai em paralelo
    window.open(url, "_blank", "noopener,noreferrer");
    const field = (key: string) => String(formData.get(key) || "").trim();
    sendLead({
      name: field("name"),
      phone: field("phone"),
      email: field("email"),
      service,
      message: field("message"),
      website: field("website"),
    });
    form.reset();
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form className="quote__form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" type="text" required placeholder="Seu nome" />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Telefone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" required placeholder="(21) 99999-9999" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required placeholder="voce@email.com" />
      </div>

      <div className="form-field">
        <label htmlFor="service">Serviço de interesse</label>
        <select id="service" name="service" defaultValue={initialService}>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="Outro / não sei ainda">Outro / não sei ainda</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="message">Mensagem (opcional)</label>
        <textarea
          id="message"
          name="message"
          placeholder="Conte um pouco sobre o seu condomínio ou necessidade."
        />
      </div>

      {/* isca anti-robô: invisível para pessoas */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={status === "redirecting"}>
        {status === "redirecting" ? "Abrindo WhatsApp..." : "Solicitar proposta"}
      </button>

      <p className="form-privacy">
        Ao enviar, você autoriza a Bihel a usar esses dados para responder ao seu pedido.{" "}
        <a href={asset("privacidade")}>Política de Privacidade</a>
      </p>

      {status === "redirecting" && (
        <p className="form-feedback form-feedback--success">
          Abrimos o WhatsApp numa nova aba com sua mensagem pronta é só enviar.
        </p>
      )}
    </form>
  );
}
