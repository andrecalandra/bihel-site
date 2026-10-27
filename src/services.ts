import { asset } from "./asset";

/**
 * Serviços do site. Cada um vira (1) um cartão na home, (2) o texto do modal e (3) uma página própria
 * em /<slug> (gerada no build por scripts/prerender.mjs).
 *  - `details`: texto completo (blocos separados por linha em branco; "* " = lista; "1. " = lista numerada).
 *  - `slug`, `pageTitle`, `h1`, `metaDescription`, `lead`: SEO da página do serviço.
 */
export const SERVICES = [
  {
    title: "Autovistoria Predial",
    slug: "autovistoria-predial",
    pageTitle: "Autovistoria Predial | Laudo Lei 6.400/2013 | Bihel Engenharia",
    h1: "Autovistoria Predial",
    metaDescription: "Laudo de autovistoria predial em conformidade com a Lei 6.400/2013 do RJ. Vistoria técnica, laudo e suporte pós-laudo. Peça orçamento.",
    lead: "Laudo de autovistoria em conformidade com a Lei 6.400/2013 do Rio de Janeiro, com vistoria técnica completa e suporte depois da entrega do laudo.",
    desc: "Laudo de autovistoria predial em conformidade com a Lei 6.400/2013 do estado do Rio de Janeiro.",
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
    title: "Inspeção de Fachada com Drone",
    slug: "inspecao-fachada-drone",
    pageTitle: "Inspeção de Fachada com Drone e Termografia | Bihel Engenharia",
    h1: "Inspeção de Fachada com Drone",
    metaDescription: "Inspeção de fachada com drone e câmera termográfica: identifica infiltrações e descolamentos sem andaimes, com relatório técnico com imagens. Peça orçamento.",
    lead: "Drone com câmera termográfica para identificar infiltrações, descolamentos e outras manifestações patológicas na fachada, de forma rápida e sem intervenção na edificação.",
    desc: "Inspeção de fachada com drone e câmera termográfica: identificação rápida e não invasiva de manifestações patológicas.",
    details: `Na Bihel Engenharia, utilizamos drones equipados com câmeras termográficas para realizar inspeções detalhadas de fachadas, unindo tecnologia de ponta a décadas de experiência técnica em engenharia predial.

Como Funciona
A câmera termográfica capta a diferença de temperatura na superfície da fachada. Áreas com infiltração, descolamento de revestimento ou falhas construtivas aquecem ou resfriam de forma diferente do restante da parede, revelando problemas invisíveis a olho nu.

Principais Aplicações
* Detecção de Infiltrações Ocultas: mapeia a umidade interna por meio da diferença de temperatura do revestimento.
* Identificação de Descolamentos: encontra falhas de aderência em pastilhas e rebocos antes que ocorram quedas de material.
* Mapeamento de Manifestações Patológicas: documenta trincas, fissuras e demais problemas estruturais e estéticos com precisão.
* Relatórios com Imagens de Alta Resolução: cada inspeção gera um relatório técnico detalhado, com registro visual de todos os pontos identificados.

Rapidez e Segurança
Por ser um ensaio não destrutivo, a inspeção com drone dispensa o uso inicial de andaimes ou balancins, reduz o incômodo aos moradores e costuma ser concluída em poucas horas de voo, com acesso seguro a áreas de difícil alcance.

Por que Escolher a Bihel Engenharia?
* Tecnologia de Ponta: drones, câmeras termográficas e software avançado para diagnósticos precisos.
* Ensaio Não Destrutivo: nenhuma intervenção física na fachada durante o mapeamento.
* Equipe Especializada: engenheiros com experiência em patologia das construções interpretam cada imagem térmica.
* Relatórios Claros: documentação técnica de fácil compreensão para síndicos, administradoras e proprietários.

Entre em contato conosco e descubra como a inspeção termográfica com drone pode antecipar problemas na fachada do seu condomínio antes que se tornem custosos ou perigosos.`,
    img: asset("assets/inspecao-termografica-drone.webp"),
  },
  {
    title: "Gestão e Fiscalização de Obras",
    slug: "gestao-fiscalizacao-obras",
    pageTitle: "Gestão e Fiscalização de Obras para Condomínios | Bihel Engenharia",
    h1: "Gestão e Fiscalização de Obras",
    metaDescription: "Gestão e fiscalização de obras para condomínios: escopo, licitação, equalização de propostas e acompanhamento da execução conforme normas técnicas. Peça orçamento.",
    lead: "Do escopo à fiscalização: elaboramos a documentação, conduzimos a licitação, comparamos propostas e acompanhamos a obra executada por terceiros.",
    desc: "Seu projeto executado com excelência, dentro do prazo e orçamento estabelecidos.",
    details: `Na Bihel Engenharia, oferecemos serviços especializados em gestão e fiscalização de obras, garantindo que seu projeto seja executado com excelência, dentro do prazo e orçamento estabelecidos. Nossa expertise abrange:

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

Fiscalização de Obras
Oferecemos um serviço abrangente de acompanhamento e fiscalização de obras realizadas por terceiros, que inclui:
* Constatação da execução conforme o projeto e cronograma
* Verificação do cumprimento das boas práticas de engenharia
* Garantia de conformidade com normas da ABNT, CBMERJ e legislação vigente

Na Bihel Engenharia, nosso compromisso é assegurar que seu projeto seja executado com a mais alta qualidade, eficiência e segurança. Conte conosco para transformar seus planos em realidade.`,
    img: asset("assets/Gerenciamento-e-fiscalizacao-de-obras-768x433.webp"),
  },
  {
    title: "Elaboração de Projetos Personalizados",
    slug: "projetos-personalizados",
    pageTitle: "Elaboração de Projetos Personalizados | Bihel Engenharia",
    h1: "Elaboração de Projetos Personalizados",
    metaDescription: "Projetos de engenharia e arquitetura sob medida para condomínios e edifícios, com equipe multidisciplinar de engenheiros e arquitetos. Peça orçamento.",
    lead: "Projetos de engenharia e arquitetura desenvolvidos sob medida para a necessidade do seu condomínio, com equipe multidisciplinar e atenção às normas da ABNT.",
    desc: "Projetos personalizados de engenharia e arquitetura, desenvolvidos sob medida para a necessidade do seu condomínio.",
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
    title: "Consultoria em Engenharia Condominial",
    slug: "consultoria-engenharia-condominial",
    pageTitle: "Consultoria Técnica para Condomínios | Engenharia Condominial | Bihel",
    h1: "Consultoria Técnica em Engenharia Condominial",
    metaDescription: "Consultoria técnica para condomínios: suporte mensal à gestão, programa de manutenção (NBR 5.674), laudos de recebimento e de garantia de obras. Peça orçamento.",
    lead: "Suporte técnico contínuo para síndicos, administradoras e proprietários: gestão, plano de manutenção, laudos de recebimento e de garantia de obras.",
    desc: "Consultoria em engenharia condominial para síndicos, administradores e proprietários de imóveis.",
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
] as const;
