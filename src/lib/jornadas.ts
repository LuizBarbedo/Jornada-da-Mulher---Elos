import { Baby, Bot, HeartPulse, type LucideIcon } from "lucide-react";

export type Jornada = {
  slug: "gestacao" | "lactacao" | "chat-ia";
  titulo: string;
  destaque: string;
  chamada: string;
  descricao: string;
  recursos: string[];
  icone: LucideIcon;
  cor: string;
};

/** Jornadas futuras exibidas como "em breve" (sem funcionalidade no MVP). */
export const JORNADAS: Jornada[] = [
  {
    slug: "gestacao",
    titulo: "Modo",
    destaque: "Gestação",
    chamada: "Quando o positivo chegar, a gente segue junto.",
    descricao:
      "Um acompanhamento semana a semana, com o desenvolvimento do bebê, as mudanças no seu corpo e conteúdos para cada trimestre.",
    recursos: ["Linha do tempo da gestação", "Lembretes de consultas e exames", "Conteúdos por trimestre"],
    icone: HeartPulse,
    cor: "bg-rose text-white",
  },
  {
    slug: "lactacao",
    titulo: "Modo",
    destaque: "Lactação",
    chamada: "Cuidado para você, nos primeiros meses do bebê.",
    descricao:
      "Apoio para a amamentação e para o pós-parto, com registros simples e orientação confiável para essa nova fase.",
    recursos: ["Registro de mamadas", "Nutrição na amamentação", "Comunidade de mães"],
    icone: Baby,
    cor: "bg-verde text-grafite",
  },
  {
    slug: "chat-ia",
    titulo: "Chat com",
    destaque: "IA científica",
    chamada: "Respostas baseadas em ciência, a qualquer hora.",
    descricao:
      "Um assistente treinado com conteúdo científico revisado para tirar dúvidas do dia a dia, sempre indicando quando procurar um(a) profissional.",
    recursos: ["Respostas com fontes", "Linguagem simples e acolhedora", "Revisão por especialistas"],
    icone: Bot,
    cor: "bg-grafite text-white",
  },
];

export function buscarJornada(slug: string) {
  return JORNADAS.find((j) => j.slug === slug);
}
