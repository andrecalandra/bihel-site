import SiteHeader from "./components/SiteHeader";
import RevealObserver from "./components/RevealObserver";
import QuoteForm from "./components/QuoteForm";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { asset } from "./asset";

const WHATSAPP_HREF =
  "https://wa.me/5521993232702?text=Ol%C3%A1!%20Visitei%20o%20site%20da%20Bihel%20Engenharia%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

const SERVICES = [
  {
    title: "Acompanhamento de Contratos",
    desc: "Para que seus projetos sejam executados dentro do prazo e do orçamento acordados.",
    img: asset("assets/Acompanhamento-de-Contratos.webp"),
  },
  {
    title: "Consultoria Técnica",
    desc: "Projetada para atender às necessidades específicas de síndicos, administradores e proprietários de imóveis.",
    img: asset("assets/Consultoria-Tecnica-768x433.webp"),
  },
  {
    title: "Perícias de Engenharia e Assistência Técnica Judicial",
    desc: "Análises técnicas precisas e imparciais para auxiliar na resolução de litígios e questões legais.",
    img: asset("assets/Pericias-de-Engenharia-e-Assistencia-Tecnica-Judicial-768x433.webp"),
  },
  {
    title: "Laudo de Autovistoria",
    desc: "Atendendo plenamente às exigências da Lei 6.400/2013 do estado do Rio de Janeiro.",
    img: asset("assets/Laudo-de-autovistoria-768x433.webp"),
  },
  {
    title: "Inspeção Predial",
    desc: "Visando garantir a segurança, funcionalidade e longevidade das edificações.",
    img: asset("assets/Inspecao-Predial-768x433.webp"),
  },
  {
    title: "Elaboração de Projetos",
    desc: "Nossa expertise em desenvolvimento de projetos de engenharia e arquitetura transforma visões em realidade.",
    img: asset("assets/Elaboracao-de-projetos-768x433.jpg"),
  },
  {
    title: "Gerenciamento e Fiscalização de Obras",
    desc: "Seu projeto executado com excelência, dentro do prazo e orçamento estabelecidos.",
    img: asset("assets/Gerenciamento-e-fiscalizacao-de-obras-768x433.webp"),
  },
] as const;

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
  return (
    <div className="landing">

      <SiteHeader />

      <main id="topo">
        {/* HERO */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__content reveal">
              <span className="eyebrow">Engenharia para condomínios em Niterói</span>
              <h1>Segurança e transparência para o seu condomínio, do laudo à obra.</h1>
              <p className="hero__lead">
                A Bihel Engenharia oferece consultoria técnica, inspeção predial, laudos de
                autovistoria e gerenciamento de obras para síndicos, administradoras e
                proprietários — com suporte técnico claro em cada etapa.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary btn--lg" href="#orcamento">
                  Solicitar orçamento
                </a>
                <a className="btn btn--ghost btn--lg" href="#servicos">
                  Conhecer serviços
                </a>
              </div>
            </div>
            <div className="hero__media reveal">
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
                  <img src={asset("assets/visao.webp")} alt="Equipe Bihel Engenharia" width={280} height={300} />
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

            <div className="services__grid">
              {SERVICES.map((service) => (
                <a
                  key={service.title}
                  className="service-card reveal"
                  href={`${import.meta.env.BASE_URL}?service=${encodeURIComponent(service.title)}#orcamento`}
                >
                  <div className="service-card__img">
                    <img src={service.img} alt={service.title} width={768} height={433} loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <span className="service-card__link">Solicitar orçamento →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="diferenciais" id="diferenciais">
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
                <p>Mais de 1 milhão de m² e 1 mil apartamentos já vistoriados em Niterói e região.</p>
              </div>
            </div>
          </div>
        </section>

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
                <a className="btn btn--ghost" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                  Prefiro falar no WhatsApp
                </a>
              </div>
              <QuoteForm
                whatsappNumber="5521993232702"
                serviceOptions={SERVICES.map((s) => s.title)}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contato">
        <div className="container footer__inner">
          <div className="footer__col footer__col--brand">
            <img
              src={asset("assets/Logo-Bihel-Engenharia-Azul-1024x689.png")}
              alt="Bihel Engenharia"
              width={200}
              height={135}
              className="footer__logo"
            />
            <p>
              Soluções especializadas de engenharia para condomínios e edifícios em Niterói e
              região, com suporte técnico transparente do início ao fim.
            </p>
          </div>

          <div className="footer__col">
            <h4>Links Úteis</h4>
            <a href="#topo">Início</a>
            <a href="#sobre">Sobre nós</a>
            <a href="#servicos">Serviços</a>
            <a href="#diferenciais">Diferenciais</a>
            <a href="#depoimentos">Depoimentos</a>
          </div>

          <div className="footer__col">
            <h4>Serviços</h4>
            <a href="#servicos">Consultoria Técnica</a>
            <a href="#servicos">Inspeção Predial</a>
            <a href="#servicos">Laudo de Autovistoria</a>
            <a href="#servicos">Elaboração de Projetos</a>
          </div>

          <div className="footer__col">
            <h4>Fale Conosco</h4>
            <p className="footer__contact"><strong>Endereço:</strong> Rua Noronha Torrezão 24, (1714) Santa Rosa, Niterói - RJ</p>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__bottom-inner">
            <span>&copy; {new Date().getFullYear()} Bihel Engenharia. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" /></svg>
      </a>

      <RevealObserver />
    </div>
  );
}
