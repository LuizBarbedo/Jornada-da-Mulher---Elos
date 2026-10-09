import type { TipoRegistro } from "./types";

/** Opções de cada tipo de registro rápido. Validadas também no servidor. */
export const OPCOES: Record<TipoRegistro, { titulo: string; pergunta: string; opcoes: string[] }> = {
  menstruacao: {
    titulo: "Menstruação",
    pergunta: "Como está o fluxo hoje?",
    opcoes: ["Leve", "Moderado", "Intenso", "Escape"],
  },
  humor: {
    titulo: "Humor",
    pergunta: "Como você está se sentindo hoje?",
    opcoes: ["Feliz", "Calma", "Esperançosa", "Ansiosa", "Triste", "Irritada", "Cansada", "Sensível"],
  },
  sintoma: {
    titulo: "Sintoma",
    pergunta: "O que você percebeu no seu corpo?",
    opcoes: [
      "Cólica",
      "Dor de cabeça",
      "Inchaço",
      "Seios sensíveis",
      "Muco elástico",
      "Acne",
      "Náusea",
      "Libido alta",
      "Dor lombar",
    ],
  },
  observacao: {
    titulo: "Observação",
    pergunta: "Quer anotar algo sobre hoje?",
    opcoes: [],
  },
};

export const TIPOS = Object.keys(OPCOES) as TipoRegistro[];
