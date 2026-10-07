import { asset } from "./asset";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  img: string;
};

/** A seção só aparece no site quando todos os membros têm nome preenchido. */
export const TEAM: TeamMember[] = [
  {
    name: "Gustavo Bihel",
    role: "Engenheiro Civil",
    bio: "Engenheiro civil, perito do TJ-RJ, especialista em avaliações e vistorias de imóveis, auditor, professor e palestrante. Está à frente da Bihel Engenharia.",
    img: asset("assets/equipe/gustavo-bihel.webp"),
  },
  {
    // foto: IMG_0446 (cabelo claro, camisa preta)
    name: "",
    role: "",
    bio: "",
    img: asset("assets/equipe/IMG_0446.webp"),
  },
  {
    // foto: IMG_0451 (cabelo liso escuro, camisa preta)
    name: "",
    role: "",
    bio: "",
    img: asset("assets/equipe/IMG_0451.webp"),
  },
  {
    // foto: IMG_0477 (cabelo ondulado, polo azul)
    name: "",
    role: "",
    bio: "",
    img: asset("assets/equipe/IMG_0477.webp"),
  },
];

export const HAS_TEAM = TEAM.every((m) => m.name.trim() !== "");
