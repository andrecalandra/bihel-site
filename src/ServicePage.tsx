import { useEffect, type ReactNode } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CookieBanner from "./components/CookieBanner";
import RevealObserver from "./components/RevealObserver";
import { startAnalytics } from "./analytics";
import { SERVICES } from "./services";
import { WHATSAPP_HREF } from "./site";

type Block =
  | { t: "h2" | "h3" | "p"; text: string }
  | { t: "ul" | "ol"; items: string[] };

/** Lê o texto do serviço (blocos separados por linha em branco, "* " = lista, "1. " = lista numerada). */
function parseDetails(text: string): Block[] {
  const lines = text.split("\n").map((l) => l.trim());
  const blocks: Block[] = [];
  let i = 0;
  let lastWasHeading = false;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    if (/^\* /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const re = ordered ? /^\d+\. / : /^\* /;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) {
        items.push(lines[i].replace(re, ""));
        i++;
      }
      blocks.push({ t: ordered ? "ol" : "ul", items });
      lastWasHeading = false;
      continue;
    }
    const isHeading = line.length <= 72 && !/[.:;,]$/.test(line);
    if (isHeading) {
      blocks.push({ t: lastWasHeading ? "h3" : "h2", text: line });
      lastWasHeading = true;
    } else {
      blocks.push({ t: "p", text: line });
      lastWasHeading = false;
    }
    i++;
  }
  return blocks;
}

/** "Título: explicação" → título em negrito. */
function Item({ text }: { text: string }): ReactNode {
  const m = text.match(/^([^:]{3,45}):\s(.+)$/);
  return m ? (
    <>
      <strong>{m[1]}:</strong> {m[2]}
    </>
  ) : (
    text
  );
}

function Content({ details }: { details: string }) {
  return (
    <>
      {parseDetails(details).map((b, idx) => {
        if (!("items" in b)) {
          if (b.t === "h2") return <h2 key={idx}>{b.text}</h2>;
          if (b.t === "h3") return <h3 key={idx}>{b.text}</h3>;
          return <p key={idx}>{b.text}</p>;
        }
        const Tag = b.t;
        return (
          <Tag key={idx}>
            {b.items.map((it, j) => (
              <li key={j}>
                <Item text={it} />
              </li>
            ))}
          </Tag>
        );
      })}
    </>
  );
}

export default function ServicePage({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    startAnalytics();
  }, []);

  if (!service) return null;
  const others = SERVICES.filter((s) => s.slug !== slug);
  const quoteHref = `./?service=${encodeURIComponent(service.title)}#orcamento`;

  return (
    <div className="landing">
      <SiteHeader homeHref="./" />

      <main id="topo">
        <section className="svc-hero">
          <div className="container svc-hero__inner">
            <div className="svc-hero__text">
              <nav className="breadcrumb" aria-label="Você está em">
                <a href="./">Início</a>
                <span aria-hidden="true">›</span>
                <a href="./#servicos">Serviços</a>
                <span aria-hidden="true">›</span>
                <span aria-current="page">{service.title}</span>
              </nav>
              <h1>{service.h1}</h1>
              <p className="svc-hero__lead">{service.lead}</p>
              <div className="svc-hero__actions">
                <a className="btn btn--primary btn--lg" href={quoteHref}>
                  Solicitar orçamento
                </a>
                <a className="btn btn--ghost btn--lg" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" data-track={`Página: ${service.title}`}>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <div className="svc-hero__media">
              <img src={service.img} alt={service.title} width={768} height={433} />
            </div>
          </div>
        </section>

        <section className="svc-body">
          <div className="container svc-body__inner">
            <article className="svc-article">
              <Content details={service.details} />
            </article>

            <aside className="svc-aside" aria-label="Solicitar orçamento">
              <div className="svc-aside__card">
                <h2>Peça seu orçamento</h2>
                <p>Atendimento técnico para condomínios e edifícios. Resposta rápida da nossa equipe.</p>
                <a className="btn btn--primary btn--block" href={quoteHref}>
                  Solicitar orçamento
                </a>
                <a
                  className="btn btn--ghost btn--block"
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track={`Página: ${service.title}`}
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="svc-others">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Outros serviços</span>
              <h2>Conheça também</h2>
            </div>
            <div className="svc-others__grid">
              {others.map((s) => (
                <a key={s.slug} className="svc-other" href={`./${s.slug}`}>
                  <img src={s.img} alt="" width={768} height={433} loading="lazy" />
                  <span>
                    <strong>{s.title}</strong>
                    <em>Saiba mais →</em>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter homeHref="./" />
      <CookieBanner />
      <WhatsAppFloat />
      <RevealObserver />
    </div>
  );
}
