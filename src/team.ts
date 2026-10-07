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

// Só no localhost: abrir /?equipe=teste mostra a seção com textos de exemplo.
// Em produção `import.meta.env.DEV` é false e isso some do build.
const preview =
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("equipe") === "teste";

export const TEAM: TeamMember[] = preview
  ? BASE_TEAM.map((m, i) =>
      m.name
        ? m
        : {
            ...m,
            name: `Nome do Colaborador ${i}`,
            role: "Cargo",
            bio: "Mini bio de exemplo com uma ou duas frases sobre a atuação e a experiência da pessoa na equipe.",
          }
    )
  : BASE_TEAM;

export const HAS_TEAM = TEAM.every((m) => m.name.trim() !== "");
