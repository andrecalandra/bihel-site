// Consentimento de cookies (Consent Mode v2 do Google). A escolha fica no próprio
// aparelho; a tag do Analytics em index.html lê a mesma chave antes de carregar.

export type Consent = "granted" | "denied";

const KEY = "bihel_cookie_consent";

/** Evento que reabre o aviso (usado pelo link "Preferências de cookies"). */
export const CONSENT_OPEN_EVENT = "bihel:consent-open";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function getConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/** Apaga os cookies do Analytics já gravados (quando a pessoa recusa depois de ter aceitado). */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n === "_gid" || n.startsWith("_ga_"));
  const parts = window.location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, i) => `.${parts.slice(i).join(".")}`)];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* sem storage: vale só nesta visita */
  }
  window.gtag?.("consent", "update", { analytics_storage: value });
  if (value === "denied") clearAnalyticsCookies();
}
