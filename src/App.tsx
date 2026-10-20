import SiteHeader from "./components/SiteHeader";
import RevealObserver from "./components/RevealObserver";
import QuoteForm from "./components/QuoteForm";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { asset } from "./asset";
import { SERVICES } from "./services";
import { WHATSAPP_HREF } from "./site";
import ServiceModal from "./components/ServiceModal";
import TeamSection from "./components/TeamSection";
import LocationSection from "./components/LocationSection";
import SiteFooter from "./components/SiteFooter";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CookieBanner from "./components/CookieBanner";
import { useEffect, useState } from "react";
import { startAnalytics, track } from "./analytics";
import { useAutoScrollCarousel } from "./useAutoScrollCarousel";

const TESTIMONIALS = [
  {
    quote:
      "Gustavo Bihel é um dos mais competentes profissionais de engenharia que conheci (e olha que conheci muitos deles), sempre com muita seriedade, profissionalismo e expertise no que faz. A todo momento me deparo com trabalhos dele nos condomínios que passo, sempre com referência positiva dos seus síndicos e/ou administradores.",
    author: "Paulo Tannuri",
    role: "Performance",
  },
  {
    quote:
      "A Bihel engenharia prestou serviço pra mim, e fiquei muito satisfeito. Recomendo para todos que fazem questão de um serviço bem feito.",
    author: "João Guilherme",
    role: null,
  },
  {
    quote:
      "É com grande satisfação que recomendo o engenheiro civil Sr Gustavo Bihel, consultor em obras, perito em engenharia civil, especializado em laudo de inspeção predial, mapeamento de patologias estruturais, análise e acompanhamento de obra e especificação do escopo da mesma. Nos últimos 04 anos atua como consultor em engenharia no nosso condomínio, pude constatar a competência e comprometimento profissional. Sua vasta experiência e conhecimento técnico foram essenciais para o sucesso dos projetos nos quais estamos executando.",
    author: "Ana Elisa",
    role: "João Jorge Nemer",
  },
  {
    quote:
      "Na qualidade de síndica do condomínio do Edifício Atlantis Residencial, é com grande satisfação que escrevo esta carta de referência. Trabalhamos com a empresa Bihel Engenharia, representado pelo Engenheiro Gustavo Bihel, desde agosto de 2022, quando realizamos a Vistoria predial obrigatória. A competência e profissionalismo ao longo dessa parceria foram excepcionais em todos os aspectos.",
    author: "Maria Esperanza",
    role: "Atlantis Residencial",
  },
  {
    quote:
      "Em Maio de 2022 realizou uma autovistoria predial minuciosa, nos entregando um laudo extremamente bem elaborado, bastante didático, onde generosamente indica como as patologias encontradas devem ser tratadas, acompanhado de um cronograma com o nível de urgência do que deve ser tratado primeiro. Acreditamos ser a melhor empresa de Engenharia Diagnóstica de nossa cidade e recomendamos fortemente.",
    author: "Síndica Carolina",
    role: "Ana Cláudia",
  },
  {
    quote:
      "Como síndica do Edifício Orquídea, recomendo e indico essa empresa pelo trabalho executado em nosso condomínio. Foi feita a vistoria predial por Gustavo Bihel e sua equipe e ficamos muito satisfeitos. Obrigada a todos que participaram.",
    author: "Márcia Figueiredo",
    role: "Orquídea",
  },
  {
    quote:
      "Profissional dedicado e cuidadoso com o resultado. Traz confiança ao gestor condominial cuidar das manutenções preventivas e corretivas.",
    author: "Ana Paula",
    role: "Síndica e Empreendedora",
  },
] as const;

export default function App() {
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string | null>(null);
  const selectedService = SERVICES.find((s) => s.title === selectedServiceTitle) ?? null;
  const servicesCarouselRef = useAutoScrollCarousel<HTMLDivElement>(SERVICES.length);

  useEffect(() => {
    startAnalytics();
  }, []);

  function openService(title: string) {
    track("service_open", title);
    setSelectedServiceTitle(title);
  }

  function handleRequestQuote(title: string) {
    track("whatsapp_click", "Janela do serviço", title);
    const message = `Olá! Tenho interesse no serviço de ${title} e gostaria de solicitar um orçamento.`;
    window.open(`https://wa.me/5521993232702?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSelectedServiceTitle(null);
  }

  return (
    <div className="landing">

      <SiteHeader />

      <main id="topo">
        {/* HERO */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__content hero-in">
              <span className="eyebrow">Engenharia para condomínios</span>
              <h1>Segurança e transparência para o seu condomínio, do laudo à obra.</h1>
              <p className="hero__lead">
                A Bihel Engenharia oferece autovistoria predial, inspeção de fachada com drone,
                gestão e fiscalização de obras, projetos e consultoria em engenharia condominial
                para síndicos, administradoras e proprietários, com suporte técnico claro em cada etapa.
              </p>
              <div className="hero__actions">
                <a
                  className="btn btn--primary btn--lg"
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar proposta
                </a>
                <a className="btn btn--ghost btn--lg" href="#servicos">
                  Conhecer serviços
                </a>
              </div>
            </div>
            <div className="hero__media hero-media-in">
              <div className="hero__blob"></div>
              <img
                src={asset("assets/Esboco-Predios-768x466.webp")}
                alt="Esboço técnico de edifícios"
                width={768}
                height={466}
                className="hero__img"
              />
            </div>
          </div>

          <div className="stats">
            <div className="container stats__grid">
              <div className="stat reveal">
                <span className="stat__number">51+</span>
                <span className="stat__label">Condomínios vistoriados</span>
              </div>
              <div className="stat reveal">
                <span className="stat__number">1 milhão+</span>
                <span className="stat__label">m² vistoriados</span>
              </div>
              <div className="stat reveal">
                <span className="stat__number">1 mil+</span>
                <span className="stat__label">Apartamentos atendidos</span>
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section className="about" id="sobre">
          <div className="container about__inner">
            <div className="about__text reveal">
              <span className="section-tag">Sobre a Bihel</span>
              <h2>Seu parceiro em soluções de engenharia</h2>
              <p>
                Fundada em Niterói, a Bihel Engenharia é especializada em gerenciamento e
                consultoria para condomínios e edifícios. Nossa missão é fornecer suporte
                técnico e transparente, garantindo segurança e qualidade em todas as etapas dos
                seus projetos de engenharia.
              </p>
            </div>
            <div className="about__cards">
              <div className="mv-card reveal">
                <div className="mv-card__img">
                  <img src={asset("assets/missao.webp")} alt="Niterói, sede da Bihel Engenharia" width={280} height={300} />
                </div>
                <div className="mv-card__body">
                  <h3>Nossa Missão</h3>
                  <p>
                    Colaborar com síndicos e administradoras de condomínios, evitando perdas
                    materiais e financeiras, e transformando clientes em parceiros comerciais.
                  </p>
                </div>
              </div>
              <div className="mv-card reveal">
                <div className="mv-card__img">
                  <img
                    src={asset("assets/visao.webp")}
                    alt="Equipe Bihel Engenharia"
                    width={280}
                    height={300}
                    style={{ objectPosition: "top" }}
                  />
                </div>
                <div className="mv-card__body">
                  <h3>Nossa Visão</h3>
                  <p>
                    Ser referência de credibilidade, confiança e excelência no atendimento
                    dentro do mercado de condomínios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICOS */}
        <section className="services" id="servicos">
          <div className="container">
            <div className="section-head reveal">
              <span className="section-tag">O que fazemos</span>
              <h2>Nossos Serviços</h2>
              <p>
                Uma linha completa de soluções de engenharia para atender todas as
                necessidades técnicas do seu condomínio.
              </p>
            </div>

            <div className="services__grid" ref={servicesCarouselRef}>
              {SERVICES.map((service, i) => (
                <a
                  key={service.title}
                  href={`./${service.slug}`}
                  className="service-card reveal"
                  style={{ transitionDelay: `${Math.min(i, 5) * 60}ms` }}
                  onClick={(e) => {
                    // clique simples abre o resumo; Ctrl/Cmd/botão do meio abrem a página do serviço
                    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      openService(service.title);
                    }
                  }}
                >
                  <div className="service-card__img">
                    <img src={service.img} alt={service.title} width={768} height={433} loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <span className="service-card__link">Ver detalhes →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="diferenciais" id="diferenciais">
          <img
            className="brand-watermark"
            src={asset("assets/icone-bihel-branco.webp")}
            alt=""
            aria-hidden="true"
            width={400}
            height={214}
            loading="lazy"
          />
          <div className="container">
            <div className="section-head section-head--light reveal">
              <span className="section-tag section-tag--light">Por que a Bihel</span>
              <h2>Diferenciais que geram confiança</h2>
            </div>
            <div className="diff__grid">
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M12 2 3 7v6c0 5 3.8 8.7 9 9 5.2-.3 9-4 9-9V7l-9-5Z" /></svg>
                <h3>Segurança Técnica</h3>
                <p>Laudos e vistorias que atendem plenamente à legislação vigente.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M12 1a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V5a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v2h4V5a2 2 0 0 0-2-2Z" /></svg>
                <h3>Transparência</h3>
                <p>Comunicação clara com síndicos e administradoras em cada etapa do projeto.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Zm0 7-8-4v2l8 4 8-4v-2l-8 4Z" /></svg>
                <h3>Excelência Técnica</h3>
                <p>Equipe especializada em engenharia e arquitetura para condomínios e edifícios.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M12 2 3 7v6c0 5 3.8 8.7 9 9 5.2-.3 9-4 9-9V7l-9-5Zm0 3.3 6 3.3v4.4c0 3.5-2.6 6.4-6 6.9-3.4-.5-6-3.4-6-6.9V8.6l6-3.3Zm-1 3.7v4l3.4 2 .8-1.3-2.7-1.6V9Z" /></svg>
                <h3>Tecnologia com Drones</h3>
                <p>Inspeção termográfica aérea que revela infiltrações e descolamentos invisíveis a olho nu.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.4l4 2.4-.8 1.3-4.7-2.8V7h1.5Z" /></svg>
                <h3>Compromisso com Prazos</h3>
                <p>Projetos executados dentro do prazo e do orçamento acordados.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.3 0-7 1.2-7 3.5V19h9v-2.5c0-1 .4-2.5 2-3.7-1-.5-2.6-.8-4-.8Zm8 0c-.3 0-.7 0-1 .1 1.5 1.1 2 2.5 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5Z" /></svg>
                <h3>Atendimento Personalizado</h3>
                <p>Cada condomínio recebe uma solução pensada para sua realidade.</p>
              </div>
              <div className="diff-card reveal">
                <svg viewBox="0 0 24 24"><path d="M5 3h14a1 1 0 0 1 1 1v16l-8-4-8 4V4a1 1 0 0 1 1-1Z" /></svg>
                <h3>Experiência Comprovada</h3>
                <p>Mais de 1 milhão de m² e 1 mil apartamentos já vistoriados.</p>
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPE */}
        <TeamSection />

        {/* DEPOIMENTOS */}
        <section className="testimonials" id="depoimentos">
          <div className="container">
            <div className="section-head reveal">
              <span className="section-tag">Quem confia na Bihel</span>
              <h2>O que nossos clientes dizem</h2>
              <p>Síndicos, administradoras e parceiros que já contaram com a Bihel Engenharia.</p>
            </div>
            <div className="reveal">
              <TestimonialsCarousel items={TESTIMONIALS} />
            </div>
          </div>
        </section>

        {/* ORCAMENTO / LEAD FORM */}
        <section className="quote" id="orcamento">
          <div className="container">
            <div className="quote__box reveal">
              <div className="quote__intro">
                <span className="section-tag">Vamos conversar</span>
                <h2>Solicite um orçamento sem compromisso</h2>
                <p>Preencha o formulário e você será direcionado ao WhatsApp com sua mensagem pronta.</p>
                <div className="quote__perk">
                  <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" /></svg>
                  Resposta rápida da nossa equipe técnica
                </div>
                <div className="quote__perk">
                  <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" /></svg>
                  Atendimento personalizado por tipo de serviço
                </div>
                <div className="quote__perk">
                  <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" /></svg>
                  Direto pelo WhatsApp, sem burocracia
                </div>
              </div>
              <QuoteForm
                whatsappNumber="5521993232702"
                serviceOptions={SERVICES.map((s) => s.title)}
              />
            </div>
          </div>
        </section>

        <LocationSection whatsappHref={WHATSAPP_HREF} />
      </main>

      <SiteFooter />

      <CookieBanner />

      <WhatsAppFloat />

      <RevealObserver />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedServiceTitle(null)}
        onRequestQuote={handleRequestQuote}
      />
    </div>
  );
}
