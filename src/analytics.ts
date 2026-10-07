// Medição de audiência própria: sem cookies, sem identificador salvo no aparelho e
// sem IP guardado (o servidor transforma o visitante num hash diário). Os números
// aparecem no painel em /painel. Veja api/collect.js.
// Quem clicou em "Recusar" no aviso de cookies não é contado aqui.
import { getConsent } from "./consent";

const OPT_OUT_KEY = "bihel_sem_registro";
const HOSTS = ["bihel-site.vercel.app", "www.bihel.com.br", "bihel.com.br"];

const SECTIONS = ["sobre", "servicos", "diferenciais", "equipe", "depoimentos", "orcamento"];

type EventName = "whatsapp_click" | "form_submit" | "service_open" | "section_view";

function enabled(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  // GitHub Pages e previews não contam; localhost só no modo de desenvolvimento.
  const allowedHost = HOSTS.includes(host) || (import.meta.env.DEV && host === "localhost");
  if (!allowedHost || navigator.webdriver) return false;
  if (getConsent() === "denied") return false;
  try {
    if (window.localStorage.getItem(OPT_OUT_KEY) === "1") return false;
  } catch {
    /* sem acesso ao storage: segue normalmente */
  }
  return true;
}

/** Repassa o evento ao Google Analytics (ele mesmo respeita o consentimento). */
function toGoogleAnalytics(name: EventName, detail?: string, service?: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  const params = { where: detail, service };
  // "generate_lead" é o evento recomendado do GA4 para formulário enviado
  window.gtag("event", name === "form_submit" ? "generate_lead" : name, params);
}

function send(body: Record<string, unknown>) {
  if (!enabled()) return;
  const data = JSON.stringify(body);
  try {
    // text/plain evita preflight de CORS; o servidor lê o texto como JSON
    if (navigator.sendBeacon?.("/api/collect", new Blob([data], { type: "text/plain" }))) return;
    void fetch("/api/collect", { method: "POST", body: data, keepalive: true, headers: { "Content-Type": "text/plain" } });
  } catch {
    /* medir nunca pode quebrar o site */
  }
}

export function track(name: EventName, detail?: string, service?: string) {
  // section_view só alimenta o painel próprio; o GA4 já mede rolagem sozinho
  if (name !== "section_view") toGoogleAnalytics(name, detail, service);
  send({ t: "ev", n: name, d: detail, s: service });
}

/** Descobre de qual botão veio o clique no WhatsApp, em português, pro painel. */
function whereOf(el: Element): string {
  const tagged = el.closest("[data-track]")?.getAttribute("data-track");
  if (tagged) return tagged;
  if (el.closest(".whatsapp-float")) return "Botão flutuante do WhatsApp";
  if (el.closest(".nav__cta")) return "Menu do celular";
  if (el.closest("header")) return "Cabeçalho";
  if (el.closest(".hero")) return "Topo da página";
  if (el.closest("footer")) return "Rodapé";
  return "Outro botão";
}

let started = false;

/** Registra a visita e liga os eventos automáticos. Chamar uma vez, no navegador. */
export function startAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;

  const params = new URLSearchParams(window.location.search);
  send({
    t: "pv",
    p: window.location.pathname,
    r: document.referrer,
    u: params.get("utm_source") ?? "",
    w: window.innerWidth,
  });

  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (link) track("whatsapp_click", whereOf(link));
    },
    true
  );

  // cada seção conta uma vez por visita, quando mais de um terço dela aparece
  if (typeof IntersectionObserver !== "undefined") {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            track("section_view", id);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 }
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
  }
}
