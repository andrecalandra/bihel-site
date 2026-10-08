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

// Chave que prova que a página foi aberta (o servidor desconfia de envios sem ela).
let leadKey = "";
let keyAt = 0;

/** Pede uma chave nova ao servidor. Chamar ao abrir o formulário e depois de cada envio. */
export async function refreshLeadKey() {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/lead-token", { cache: "no-store" });
    if (res.ok) {
      leadKey = (await res.json()).k ?? "";
      keyAt = Date.now();
    }
  } catch {
    /* sem rede: o envio segue sem chave e cai em "Suspeitos" para a equipe conferir */
  }
}

/** Renova a chave se estiver velha (a aba pode ficar aberta por horas). */
export function ensureFreshKey() {
  if (!leadKey || Date.now() - keyAt > 45 * 60 * 1000) void refreshLeadKey();
}

export function sendLead(fields: LeadFields) {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    void fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "text/plain" }, // evita preflight de CORS
      body: JSON.stringify({ ...fields, k: leadKey, r: document.referrer, u: params.get("utm_source") ?? "" }),
    })
      .catch(() => {})
      .finally(() => void refreshLeadKey()); // a chave vale para um envio só
    leadKey = "";
  } catch {
    /* sem rede ou bloqueado: segue só pelo WhatsApp */
  }
}
