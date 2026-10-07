// Guarda o pedido de orçamento para a equipe ver no painel (/painel). Roda em paralelo ao
// WhatsApp e nunca atrapalha o envio: se falhar, a pessoa continua sendo atendida normalmente.
export interface LeadFields {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  website: string; // campo-isca escondido (robôs preenchem)
}

export function sendLead(fields: LeadFields) {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    void fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "text/plain" }, // evita preflight de CORS
      body: JSON.stringify({ ...fields, r: document.referrer, u: params.get("utm_source") ?? "" }),
    }).catch(() => {});
  } catch {
    /* sem rede ou bloqueado: segue só pelo WhatsApp */
  }
}
