import { useEffect, useState } from "react";
import { asset } from "../asset";
import { CONSENT_OPEN_EVENT, getConsent, setConsent, type Consent } from "../consent";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // pequena espera: o aviso não disputa com a primeira pintura da página
    const timer = getConsent() === null ? setTimeout(() => setMounted(true), 900) : undefined;
    const reopen = () => setMounted(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  if (!mounted) return null;

  function choose(value: Consent) {
    setConsent(value);
    setVisible(false);
    setTimeout(() => setMounted(false), 450);
  }

  return (
    <div
      className={`cookie-banner ${visible ? "is-visible" : ""}`}
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
    >
      <p className="cookie-banner__title">Usamos cookies</p>
      <p>
        Para entender como o site é usado e melhorar a sua experiência. Você decide: sem o seu
        aceite, nenhum cookie de medição é gravado. Saiba mais na{" "}
        <a href={asset("privacidade")}>Política de Privacidade</a>.
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__btn cookie-banner__btn--reject" onClick={() => choose("denied")}>
          Recusar
        </button>
        <button type="button" className="cookie-banner__btn cookie-banner__btn--accept" onClick={() => choose("granted")}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
