import { useEffect, useState } from "react";
import { asset } from "../asset";

const WHATSAPP_HREF =
  "https://wa.me/5521993232702?text=Ol%C3%A1!%20Visitei%20o%20site%20da%20Bihel%20Engenharia%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

const NAV_LINKS = [
  { href: "#topo", label: "Início" },
  { href: "#sobre", label: "Sobre Nós" },
  { href: "#servicos", label: "Serviços" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#orcamento", label: "Orçamento" },
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className="header"
      style={{
        boxShadow: isScrolled
          ? "0 8px 24px rgba(13,20,48,0.12)"
          : "0 4px 16px rgba(13,20,48,0.06)",
      }}
    >
      <div className="container header__inner">
        <a href="#topo" className="logo">
          {/* <picture> garante que o navegador baixe só uma das duas imagens
              (nunca as duas), conforme a largura da tela. */}
          <picture>
            <source
              media="(max-width: 760px)"
              srcSet={asset("assets/icone-bihel.webp")}
            />
            <img
              src={asset("assets/Logo-Bihel-Engenharia-Azul-1024x689.png")}
              alt="Bihel Engenharia"
              width={260}
              height={175}
              className="logo__img"
            />
          </picture>
        </a>

        <nav className={`nav ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
          <button
            className="nav__close"
            aria-label="Fechar menu"
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
          >
            ✕
          </button>
          <div className="nav__links">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${0.08 + i * 0.05}s` : "0s" }}
              >
                <span className="nav__num">{String(i + 1).padStart(2, "0")}</span>
                {link.label}
              </a>
            ))}
          </div>
          <a
            className="btn btn--primary btn--lg nav__cta"
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isOpen ? 0 : -1}
          >
            Solicitar proposta
          </a>
        </nav>

        <div className="header__actions">
          <a
            className="btn btn--primary"
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
            </svg>
            Solicitar proposta
          </a>
          <button
            className={`hamburger ${isOpen ? "is-open" : ""}`}
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
