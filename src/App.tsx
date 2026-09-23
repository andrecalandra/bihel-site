import SiteHeader from "./components/SiteHeader";
import RevealObserver from "./components/RevealObserver";
import QuoteForm from "./components/QuoteForm";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import { asset } from "./asset";
import ServiceModal from "./components/ServiceModal";
import { useState } from "react";

const WHATSAPP_HREF =
  "https://wa.me/5521993232702?text=Ol%C3%A1!%20Visitei%20o%20site%20da%20Bihel%20Engenharia%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

// `details` é o texto completo mostrado no modal ao clicar no card.
const SERVICES = [
  {
    title: "Acompanhamento de Contratos",
    desc: "Para que seus projetos sejam executados dentro do prazo e do orçamento acordados.",
    details: `Nosso serviço abrangente inclui:

Análise Inicial de Contratos
* Revisão detalhada de cláusulas técnicas e comerciais
* Identificação de possíveis riscos e inconsistências
* Sugestões de melhorias e ajustes para proteção dos interesses do cliente
* Verificação da conformidade com normas técnicas e legislação vigente

Acompanhamento Contínuo
* Monitoramento regular do cumprimento das cláusulas contratuais
* Verificação da qualidade e conformidade dos serviços prestados
* Acompanhamento de cronogramas e prazos estabelecidos
* Avaliação de solicitações de aditivos e alterações contratuais

Suporte Técnico-Jurídico
* Assessoria na interpretação de cláusulas técnicas complexas
* Apoio na resolução de conflitos e disputas contratuais
* Orientação sobre direitos e obrigações das partes envolvidas
* Elaboração de pareceres técnicos para suporte em negociações

Gestão de Documentação
* Organização e controle de documentos técnicos relacionados ao contrato
* Manutenção de registros atualizados de todas as comunicações relevantes
* Elaboração de relatórios periódicos sobre o andamento do contrato

Avaliação de Desempenho
* Análise do desempenho dos fornecedores e prestadores de serviços
* Verificação do cumprimento de metas e indicadores de qualidade
* Recomendações para melhoria contínua e otimização de processos

Nossa Abordagem
1. Análise Inicial: Estudo aprofundado do contrato e das necessidades específicas do cliente.
2. Planejamento Estratégico: Desenvolvimento de um plano de acompanhamento personalizado.
3. Monitoramento Contínuo: Acompanhamento regular e proativo do contrato.
4. Comunicação Eficiente: Relatórios claros e objetivos sobre o andamento do contrato.
5. Ação Preventiva: Identificação antecipada de potenciais problemas e proposição de soluções.
6. Suporte Especializado: Assistência técnica e jurídica sempre que necessário.

Por que Escolher a Bihel Engenharia?
* Expertise Multidisciplinar: Nossa equipe combina conhecimentos em engenharia e direito contratual.
* Experiência Comprovada: Vasta experiência no acompanhamento de contratos técnicos complexos.
* Abordagem Proativa: Foco na prevenção de problemas e otimização de resultados.
* Tecnologia Avançada: Utilização de software especializado para gestão e acompanhamento de contratos.
* Personalização: Serviços adaptados às necessidades específicas de cada cliente e projeto.
* Compromisso com a Excelência: Busca constante pela satisfação do cliente e pelo sucesso do projeto.

Na Bihel Engenharia, entendemos que contratos bem gerenciados são fundamentais para o sucesso de qualquer empreendimento. Nosso serviço de acompanhamento de contratos visa não apenas garantir o cumprimento das obrigações contratuais, mas também otimizar resultados e proteger os interesses de nossos clientes.

Conte com a Bihel Engenharia para uma gestão eficiente e segura dos seus contratos técnicos. Entre em contato conosco hoje e descubra como podemos agregar valor ao seu projeto através de um acompanhamento contratual especializado e de alta qualidade.`,
    img: asset("assets/Acompanhamento-de-Contratos.webp"),
  },
  {
    title: "Consultoria Técnica",
    desc: "Projetada para atender às necessidades específicas de síndicos, administradores e proprietários de imóveis.",
    details: `Na Bihel Engenharia, oferecemos uma gama abrangente de serviços de consultoria técnica, projetados para atender às necessidades específicas de síndicos, administradores e proprietários de imóveis. Nossa expertise técnica e abordagem inovadora garantem soluções eficazes e personalizadas para cada cliente.

Nossos Serviços

Suporte Mensal à Gestão de Condomínios
Oferecemos suporte contínuo e especializado para síndicos e administradores na gestão de condomínios edilícios, incluindo:
* Assessoria técnica em decisões de manutenção e melhorias
* Orientação sobre conformidade com normas e legislações
* Apoio na elaboração de planos de manutenção preventiva
* Assistência na avaliação de propostas de fornecedores

Inspeção de Fachadas com Drone
Realizamos inspeções detalhadas de fachadas utilizando aeronaves não tripuladas (drones), oferecendo:
* Identificação precisa de manifestações patológicas
* Análise das causas de problemas estruturais e estéticos
* Utilização de câmeras termográficas para detecção de infiltrações e outros problemas ocultos
* Acesso seguro a áreas de difícil alcance
* Relatórios detalhados com imagens de alta resolução

Elaboração de Programa de Manutenção
Desenvolvemos documentação técnica completa para atendimento à NBR 5.674, incluindo:
* Estabelecimento de prazos para manutenções periódicas
* Detalhamento das manutenções necessárias e suas frequências
* Criação de cronogramas personalizados para cada edificação
* Orientações para garantir o pleno funcionamento e longevidade da edificação

Laudo de Recebimento de Obras
Realizamos inspeções técnicas minuciosas em construções recém-entregues, verificando:
* Conformidade com os projetos originais
* Identificação de problemas construtivos e falhas de execução
* Avaliação de possíveis riscos para os ocupantes
* Elaboração de relatório detalhado com recomendações

Laudo de Garantia de Obras
Oferecemos inspeções prediais especializadas para identificar:
* Falhas construtivas aparentes
* Vícios redibitórios (ocultos) na construção
* Análise da conformidade com as garantias oferecidas pela construtora
* Recomendações para correções e melhorias necessárias

Nossa Abordagem
1. Avaliação Inicial: Análise detalhada das necessidades específicas do cliente e da edificação.
2. Planejamento Personalizado: Desenvolvimento de um plano de ação customizado.
3. Execução Técnica: Realização de inspeções, análises e elaboração de documentação com rigor técnico.
4. Relatórios Claros: Produção de relatórios detalhados e de fácil compreensão.
5. Suporte Contínuo: Acompanhamento e orientação na implementação das recomendações.

Por que Escolher a Bihel Engenharia?
* Expertise Multidisciplinar: Equipe de engenheiros especializados em diversas áreas da construção civil.
* Tecnologia de Ponta: Utilização de drones, câmeras termográficas e software avançado para diagnósticos precisos.
* Conformidade Normativa: Conhecimento aprofundado das normas técnicas e legislações pertinentes.
* Atendimento Personalizado: Soluções adaptadas às necessidades específicas de cada cliente e edificação.
* Compromisso com a Qualidade: Foco na excelência técnica e na satisfação do cliente.

Na Bihel Engenharia, nossa missão é proporcionar tranquilidade e segurança aos nossos clientes através de consultorias técnicas de alta qualidade. Seja para a gestão eficiente de condomínios, inspeções especializadas ou elaboração de documentação técnica, estamos preparados para atender às suas necessidades com excelência e profissionalismo.

Entre em contato conosco hoje para descobrir como nossa consultoria técnica pode agregar valor ao seu empreendimento e garantir a longevidade e segurança da sua edificação.`,
    img: asset("assets/Consultoria-Tecnica-768x433.webp"),
  },
  {
    title: "Perícias de Engenharia e Assistência Técnica Judicial",
    desc: "Análises técnicas precisas e imparciais para auxiliar na resolução de litígios e questões legais.",
    details: `Na Bihel Engenharia, oferecemos serviços especializados em perícias de engenharia e assistência técnica judicial, proporcionando análises técnicas precisas e imparciais para auxiliar na resolução de litígios e questões legais relacionadas à engenharia.

Nossos Serviços

Perícias de Engenharia
Realizamos perícias técnicas abrangentes em diversas áreas da engenharia, incluindo:
* Avaliação de patologias construtivas
* Análise de acidentes em obras
* Verificação de conformidade com normas técnicas
* Avaliação de danos estruturais
* Perícias em instalações elétricas e hidráulicas
* Análise de problemas em fundações e contenções
* Avaliação de impactos ambientais em obras

Assistência Técnica Judicial
Oferecemos suporte técnico especializado para processos judiciais, incluindo:
* Elaboração de laudos periciais
* Assistência técnica a advogados em casos de engenharia
* Participação em audiências como perito assistente
* Esclarecimentos técnicos em questões judiciais
* Contraprovas técnicas em processos litigiosos

Nossa Abordagem
1. Análise Inicial: Avaliação detalhada do caso e das necessidades específicas.
2. Planejamento: Desenvolvimento de um plano de ação personalizado.
3. Coleta de Dados: Realização de vistorias, medições e coleta de evidências.
4. Análise Técnica: Estudo aprofundado dos dados coletados.
5. Elaboração do Laudo: Produção de um relatório técnico detalhado e objetivo.
6. Apresentação: Exposição clara dos resultados, incluindo suporte em audiências quando necessário.

Por que Escolher a Bihel Engenharia?
1. Expertise Multidisciplinar: Nossa equipe é composta por engenheiros especializados em diversas áreas, garantindo uma análise abrangente e precisa.
2. Imparcialidade e Ética: Mantemos um compromisso inabalável com a verdade técnica e a ética profissional.
3. Experiência Judicial: Vasta experiência em processos judiciais e conhecimento das necessidades específicas do ambiente legal.
4. Tecnologia Avançada: Utilizamos equipamentos e software de ponta para análises precisas e não invasivas.
5. Laudos Claros e Objetivos: Nossos relatórios são elaborados de forma clara, detalhada e fundamentada, facilitando a compreensão por parte de juízes, advogados e partes envolvidas.
6. Cumprimento de Prazos: Entendemos a importância dos prazos judiciais e nos comprometemos a cumpri-los rigorosamente.
7. Suporte Contínuo: Oferecemos assistência completa durante todo o processo judicial, incluindo esclarecimentos e defesa do laudo pericial.

Áreas de Atuação
* Construção Civil
* Engenharia Estrutural
* Engenharia Elétrica
* Engenharia Hidráulica
* Engenharia Ambiental
* Engenharia de Segurança do Trabalho
* Avaliações e Perícias Imobiliárias

Na Bihel Engenharia, combinamos conhecimento técnico aprofundado com experiência jurídica para fornecer perícias e assistência técnica judicial de alta qualidade. Nosso objetivo é contribuir para a elucidação de questões técnicas complexas, auxiliando na busca pela justiça e resolução adequada de litígios.

Conte com a Bihel Engenharia para perícias de engenharia precisas e assistência técnica judicial confiável. Entre em contato conosco para discutir como podemos ajudar no seu caso.`,
    img: asset("assets/Pericias-de-Engenharia-e-Assistencia-Tecnica-Judicial-768x433.webp"),
  },
  {
    title: "Laudo de Autovistoria",
    desc: "Atendendo plenamente às exigências da Lei 6.400/2013 do estado do Rio de Janeiro.",
    details: `Na Bihel Engenharia, oferecemos serviços especializados na realização de Laudos de Autovistoria, atendendo plenamente às exigências da Lei 6.400/2013 do estado do Rio de Janeiro e às leis municipais complementares. Nosso compromisso é garantir a segurança e a conformidade legal das edificações, proporcionando tranquilidade aos proprietários e gestores de imóveis.

O que é o Laudo de Autovistoria?
O Laudo de Autovistoria é um documento técnico que atesta as condições de conservação, estabilidade e segurança de uma edificação. Este laudo é obrigatório no estado do Rio de Janeiro, conforme estabelecido pela Lei 6.400/2013, e visa prevenir acidentes e garantir a integridade estrutural dos imóveis.

Nossos Serviços

Vistoria Técnica Abrangente
* Inspeção detalhada de todos os sistemas e estruturas do edifício
* Avaliação de elementos estruturais, fachadas, instalações elétricas e hidráulicas
* Verificação de condições de segurança contra incêndio e pânico
* Análise de acessibilidade e condições gerais de uso da edificação

Elaboração do Laudo Técnico
* Relatório detalhado das condições encontradas
* Registro fotográfico das inspeções realizadas
* Identificação de não conformidades e problemas estruturais
* Recomendações técnicas para correções e melhorias necessárias

Conformidade Legal
* Atendimento integral às exigências da Lei 6.400/2013 do Rio de Janeiro
* Observância às leis municipais complementares específicas de cada localidade
* Garantia de que o laudo cumpre todos os requisitos legais e técnicos exigidos

Suporte Pós-Laudo
* Orientação para implementação das recomendações do laudo
* Assistência na interação com órgãos fiscalizadores, se necessário
* Acompanhamento para garantir que as medidas corretivas sejam adequadamente implementadas

Por que Escolher a Bihel Engenharia?
1. Expertise Técnica: Nossa equipe é composta por engenheiros altamente qualificados e experientes em vistorias prediais.
2. Conhecimento Legislativo: Mantemo-nos atualizados sobre todas as legislações pertinentes, garantindo laudos sempre em conformidade.
3. Tecnologia Avançada: Utilizamos equipamentos de última geração para diagnósticos precisos e não invasivos.
4. Relatórios Claros e Objetivos: Nossos laudos são elaborados de forma clara e compreensível, facilitando a tomada de decisões.
5. Compromisso com a Segurança: Priorizamos a segurança dos ocupantes e a integridade da edificação em todas as nossas avaliações.
6. Atendimento Personalizado: Oferecemos soluções adaptadas às necessidades específicas de cada edificação e cliente.

Na Bihel Engenharia, não apenas cumprimos a lei, mas também nos empenhamos em proporcionar segurança e tranquilidade aos nossos clientes. Conte conosco para realizar o Laudo de Autovistoria da sua edificação com excelência técnica e total conformidade legal.

Garanta a segurança da sua edificação e a conformidade com a legislação. Entre em contato conosco hoje para agendar seu Laudo de Autovistoria!`,
    img: asset("assets/Laudo-de-autovistoria-768x433.webp"),
  },
  {
    title: "Inspeção Predial",
    desc: "Visando garantir a segurança, funcionalidade e longevidade das edificações.",
    details: `Na Bihel Engenharia, oferecemos serviços especializados de inspeção predial para garantir a segurança, funcionalidade e longevidade das edificações. Nossa equipe de engenheiros altamente qualificados realiza avaliações minuciosas para identificar e prevenir problemas estruturais e de manutenção.

Avaliação do Estado de Conservação
Nosso serviço de inspeção predial inclui uma avaliação abrangente do estado de conservação das edificações, fornecendo:
* Identificação detalhada de manifestações patológicas existentes
* Análise das causas subjacentes aos problemas identificados
* Recomendações de tratativas e soluções adequadas
* Elaboração de relatório técnico completo e acessível

Relatório Técnico Detalhado
Após a inspeção, fornecemos um relatório técnico abrangente que inclui:
1. Descrição das condições gerais da edificação
2. Detalhamento das manifestações patológicas encontradas
3. Análise das possíveis causas de cada problema
4. Recomendações de tratativas e reparos necessários
5. Priorização das intervenções recomendadas
6. Estimativas de custos para as reparações sugeridas

Análise de Documentação NBR 16.280
Oferecemos serviços especializados de análise de documentação conforme a NBR 16.280, que inclui:
* Verificação da conformidade dos documentos com as normas vigentes
* Identificação de possíveis não conformidades ou lacunas na documentação
* Recomendações para adequação e compliance

Suporte Técnico para Reformas em Condomínios
Prestamos suporte técnico abrangente a síndicos, administradoras e condomínios, abrangendo:
* Análise detalhada de projetos de reforma propostos por condôminos
* Avaliação da viabilidade técnica e impacto das reformas na estrutura do edifício
* Aprovação de projetos que atendam às normas e regulamentações
* Acompanhamento técnico durante a execução das obras
* Garantia de que as reformas não comprometam a integridade estrutural ou estética do condomínio

Nossos Diferenciais
* Expertise Técnica: Nossa equipe possui ampla experiência em inspeções prediais e conhecimento atualizado das normas técnicas.
* Tecnologia Avançada: Utilizamos equipamentos de ponta para diagnósticos precisos e não invasivos.
* Abordagem Preventiva: Identificamos problemas potenciais antes que se tornem críticos, economizando custos a longo prazo.
* Relatórios Claros e Acionáveis: Fornecemos recomendações práticas e priorizadas para facilitar a tomada de decisões.
* Suporte Contínuo: Oferecemos acompanhamento e orientação durante todo o processo de reparos e reformas.

Na Bihel Engenharia, nossa missão é garantir a segurança, o conforto e a valorização do seu patrimônio imobiliário. Conte conosco para uma inspeção predial minuciosa e profissional que trará tranquilidade e economia a longo prazo.`,
    img: asset("assets/Inspecao-Predial-768x433.webp"),
  },
  {
    title: "Elaboração de Projetos",
    desc: "Nossa expertise em desenvolvimento de projetos de engenharia e arquitetura transforma visões em realidade.",
    details: `Na Bihel Engenharia, nossa expertise em desenvolvimento de projetos de engenharia e arquitetura transforma visões em realidade. Oferecemos soluções personalizadas e inovadoras para atender às necessidades específicas de cada cliente.

Desenvolvimento de Projetos de Engenharia e Arquitetura
Nossa equipe multidisciplinar de engenheiros e arquitetos trabalha em sinergia para oferecer projetos abrangentes e integrados, que incluem:

Projetos de Engenharia
* Projetos Estruturais
* Projetos Hidráulicos
* Projetos Elétricos
* Projetos de HVAC (Aquecimento, Ventilação e Ar Condicionado)
* Projetos de Automação e Controle
* Projetos de Eficiência Energética
* Projetos de Telecomunicações

Projetos de Arquitetura
* Projetos Arquitetônicos Residenciais
* Projetos Arquitetônicos Comerciais
* Projetos de Interiores
* Projetos de Paisagismo
* Projetos de Reformas e Retrofits
* Projetos de Acessibilidade

Nossa Abordagem
1. Análise de Requisitos: Compreendemos profundamente as necessidades e expectativas do cliente.
2. Concepção: Desenvolvemos conceitos inovadores alinhados com os objetivos do projeto.
3. Detalhamento: Elaboramos projetos detalhados, incluindo plantas, cortes, elevações e especificações técnicas.
4. Compatibilização: Garantimos a integração harmoniosa entre todas as disciplinas do projeto.
5. Otimização: Buscamos soluções que maximizem eficiência, sustentabilidade e custo-benefício.
6. Documentação: Preparamos toda a documentação necessária para aprovações e execução.

Diferenciais Bihel
* Inovação: Utilizamos as mais recentes tecnologias e metodologias de projeto, incluindo BIM (Building Information Modeling).
* Sustentabilidade: Integramos princípios de construção verde e eficiência energética em todos os nossos projetos.
* Conformidade: Garantimos que todos os projetos atendam às normas da ABNT, legislações locais e padrões internacionais de qualidade.
* Flexibilidade: Adaptamos nossa abordagem para atender às especificidades de cada projeto, seja ele de pequena, média ou grande escala.

Na Bihel Engenharia, não apenas elaboramos projetos, mas criamos soluções que inspiram, funciona e perduram. Conte conosco para transformar suas ideias em projetos excepcionais que superam expectativas e estabelecem novos padrões de excelência em engenharia e arquitetura.`,
    img: asset("assets/Elaboracao-de-projetos-768x433.jpg"),
  },
  {
    title: "Gerenciamento e Fiscalização de Obras",
    desc: "Seu projeto executado com excelência, dentro do prazo e orçamento estabelecidos.",
    details: `Na Bihel Engenharia, oferecemos serviços especializados em gerenciamento e fiscalização de obras, garantindo que seu projeto seja executado com excelência, dentro do prazo e orçamento estabelecidos. Nossa expertise abrange:

Elaboração de Escopo
Desenvolvemos um escopo detalhado e preciso para seu projeto, assegurando que todas as necessidades sejam atendidas e que haja uma base sólida para as fases subsequentes.

Documentação Técnica para Contratação
Preparamos toda a documentação técnica necessária para a contratação de serviços de terceiros, garantindo clareza e conformidade com as exigências do seu projeto.

Licitação de Obras
Conduzimos processos licitatórios completos, baseados em:
* Documentos técnicos rigorosos
* Necessidades específicas do cliente
* Análise criteriosa do mercado

Nosso objetivo é identificar e contratar a empresa de engenharia que ofereça a melhor relação custo-benefício e possua a expertise necessária para o escopo desenvolvido.

Equalização de Propostas
Realizamos uma verificação minuciosa das propostas técnicas apresentadas por empresas terceiras, com foco em:
* Equalização dos escopos ofertados
* Análise comparativa de preços
* Apresentação ao cliente da proposta com o melhor custo-benefício

Gerenciamento e Fiscalização de Obras
Oferecemos um serviço abrangente de acompanhamento e fiscalização de obras realizadas por terceiros, que inclui:
* Constatação da execução conforme o projeto e cronograma
* Verificação do cumprimento das boas práticas de engenharia
* Garantia de conformidade com normas da ABNT, CBMERJ e legislação vigente

Na Bihel Engenharia, nosso compromisso é assegurar que seu projeto seja executado com a mais alta qualidade, eficiência e segurança. Conte conosco para transformar seus planos em realidade.`,
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
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string | null>(null);
  const selectedService = SERVICES.find((s) => s.title === selectedServiceTitle) ?? null;

  function handleRequestQuote(title: string) {
    window.location.href = `${import.meta.env.BASE_URL}?service=${encodeURIComponent(title)}#orcamento`;
  }

  return (
    <div className="landing">

      <SiteHeader />

      <main id="topo">
        {/* HERO */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__content hero-in">
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
              {SERVICES.map((service, i) => (
                <button
                  key={service.title}
                  type="button"
                  className="service-card reveal"
                  style={{ transitionDelay: `${Math.min(i, 5) * 60}ms` }}
                  onClick={() => setSelectedServiceTitle(service.title)}
                >
                  <div className="service-card__img">
                    <img src={service.img} alt={service.title} width={768} height={433} loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <span className="service-card__link">Ver detalhes →</span>
                  </div>
                </button>
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

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedServiceTitle(null)}
        onRequestQuote={handleRequestQuote}
      />
    </div>
  );
}
