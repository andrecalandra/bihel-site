import { asset } from "../asset";
import { CONSENT_OPEN_EVENT } from "../consent";
import { SERVICES } from "../services";
import { HAS_TEAM } from "../team";
import { ADDRESS_TEXT } from "./LocationSection";

const INSTAGRAM_URL = "https://www.instagram.com/bihel.engenharia/";

/** `homeHref`: "" na própria home; "./" nas páginas de serviço (os links de seção viram "./#sobre" etc.). */
export default function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const h = (hash: string) => `${homeHref}${hash}`;
  return (
    <footer className="footer" id="contato">
      <div className="container footer__inner">
        <div className="footer__col footer__col--brand">
          <img
            src={asset("assets/logo-bihel-branca.webp")}
            alt="Bihel Engenharia"
            width={900}
            height={565}
            className="footer__logo"
            loading="lazy"
          />
          <p>
            Soluções especializadas de engenharia para condomínios e edifícios, com suporte
            técnico transparente do início ao fim.
          </p>
          <a
            className="footer__social"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Bihel Engenharia (abre em nova aba)"
          >
            <span className="footer__social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
              </svg>
            </span>
            @bihel.engenharia
          </a>
        </div>

        <div className="footer__col">
          <h4>Links Úteis</h4>
          <a href={homeHref ? homeHref : "#topo"}>Início</a>
          <a href={h("#sobre")}>Sobre nós</a>
          <a href={h("#servicos")}>Serviços</a>
          <a href={h("#diferenciais")}>Diferenciais</a>
          {HAS_TEAM && <a href={h("#equipe")}>Nossa equipe</a>}
          <a href={h("#depoimentos")}>Depoimentos</a>
          <a href={h("#localizacao")}>Onde estamos</a>
        </div>

        <div className="footer__col">
          <h4>Serviços</h4>
          {SERVICES.map((s) => (
            <a key={s.slug} href={`./${s.slug}`}>
              {s.title}
            </a>
          ))}
        </div>

        <div className="footer__col">
          <h4>Fale Conosco</h4>
          <p className="footer__contact">
            <strong>Endereço:</strong> {ADDRESS_TEXT}
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>&copy; {new Date().getFullYear()} Bihel Engenharia. Todos os direitos reservados.</span>
          <a className="footer__admin-link" href={asset("privacidade")}>
            Política de Privacidade
          </a>
          <button
            type="button"
            className="footer__cookie-link"
            onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
          >
            Preferências de cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
