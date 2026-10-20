import { asset } from "./asset";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  img: string;
};

/** A seção só aparece no site quando todos os membros têm nome preenchido. */
const BASE_TEAM: TeamMember[] = [
  {
    name: "Gustavo Bihel",
    role: "Engenheiro Civil",
    bio: "Engenheiro civil, perito do TJ-RJ, especialista em avaliações e vistorias de imóveis, auditor, professor e palestrante. Está à frente da Bihel Engenharia.",
    img: asset("assets/equipe/gustavo-bihel.webp"),
  },
  {
    // foto: IMG_0446 (cabelo claro, camisa preta)
    name: "Kamila Silva",
    role: "Engenheira Civil",
    bio: "Engenheira civil da equipe da Bihel Engenharia, atuando no acompanhamento técnico de condomínios e edifícios.",
    img: asset("assets/equipe/IMG_0446.webp"),
  },
  {
    // foto: IMG_0451 (cabelo liso escuro, camisa preta)
    name: "Ingrid Glória",
    role: "Trainee de Arquitetura",
    bio: "Trainee de arquitetura da Bihel Engenharia, apoiando o desenvolvimento de projetos e o trabalho técnico da equipe.",
    img: asset("assets/equipe/IMG_0451.webp"),
  },
  {
    // foto: IMG_0477 (cabelo ondulado, polo azul)
    name: "Beatriz Amaral",
    role: "Estagiária de Engenharia",
    bio: "Estagiária de engenharia da Bihel Engenharia, acompanhando vistorias, laudos e o dia a dia técnico da equipe.",
    img: asset("assets/equipe/IMG_0477.webp"),
  },
];

/**
 * Prévia com textos provisórios: só use `true` se algum membro voltar a ficar sem nome. Com todos
 * os nomes preenchidos (como agora), deixe `false`.
 */
const SHOW_PLACEHOLDERS = false;

export const TEAM: TeamMember[] = SHOW_PLACEHOLDERS
  ? BASE_TEAM.map((m) =>
      m.name
        ? m
        : {
            ...m,
            name: "Nome do colaborador",
            role: "Cargo a definir",
            bio: "Mini bio a definir: uma ou duas frases sobre a atuação e a experiência da pessoa na equipe.",
          }
    )
  : BASE_TEAM;

export const HAS_TEAM = TEAM.every((m) => m.name.trim() !== "");
