import { diferencaDias, somarDias } from "./datas";

// Modelo simples de calendário (estimativa, não diagnóstico):
// - menstruação: dias 1 a 5
// - ovulação: duração do ciclo − 14 (fase lútea de ~14 dias)
// - janela fértil: 5 dias antes da ovulação até 1 dia depois
// - fase folicular: entre a menstruação e a janela fértil
// - fase lútea: depois da janela fértil até o fim do ciclo

export const DIAS_MENSTRUACAO = 5;

export type Fase = "menstrual" | "folicular" | "fertil" | "ovulacao" | "lutea";

export type InfoDia = { fase: Fase; diaCiclo: number };

export function infoDoDia(data: string, dum: string, duracao: number): InfoDia | null {
  const diff = diferencaDias(dum, data);
  if (diff < 0) return null; // antes do primeiro ciclo registrado
  const diaCiclo = (diff % duracao) + 1;
  const ovulacao = duracao - 14;

  if (diaCiclo <= DIAS_MENSTRUACAO) return { fase: "menstrual", diaCiclo };
  if (diaCiclo === ovulacao) return { fase: "ovulacao", diaCiclo };
  if (diaCiclo >= ovulacao - 5 && diaCiclo <= ovulacao + 1) return { fase: "fertil", diaCiclo };
  if (diaCiclo < ovulacao - 5) return { fase: "folicular", diaCiclo };
  return { fase: "lutea", diaCiclo };
}

/** Início do ciclo que contém `hoje` (ou a própria DUM se ela for futura). */
function inicioCicloAtual(hoje: string, dum: string, duracao: number): string {
  const diff = diferencaDias(dum, hoje);
  if (diff < 0) return dum;
  return somarDias(dum, Math.floor(diff / duracao) * duracao);
}

export function previsoes(hoje: string, dum: string, duracao: number) {
  const inicio = inicioCicloAtual(hoje, dum, duracao);
  const proxima = diferencaDias(dum, hoje) < 0 ? dum : somarDias(inicio, duracao);
  const ovulacao = somarDias(inicio, duracao - 15);
  return {
    proximaMenstruacao: proxima,
    diasAteProxima: diferencaDias(hoje, proxima),
    janelaFertil: { inicio: somarDias(ovulacao, -5), fim: somarDias(ovulacao, 1) },
    ovulacao,
  };
}

export const FASES: Record<Fase, { nome: string; dica: string }> = {
  menstrual: {
    nome: "Fase menstrual",
    dica: "Seu corpo pede acolhimento. Hidrate-se, prefira refeições quentes e ricas em ferro e respeite seu ritmo.",
  },
  folicular: {
    nome: "Fase folicular",
    dica: "A energia costuma voltar aos poucos. Um bom momento para movimentar o corpo e cuidar da alimentação.",
  },
  fertil: {
    nome: "Janela fértil",
    dica: "Estes são os dias com mais chances de concepção. Observe sinais como o muco mais elástico e transparente.",
  },
  ovulacao: {
    nome: "Ovulação estimada",
    dica: "Hoje é o dia estimado da ovulação. Lembre-se: é uma previsão, e cada corpo tem seu próprio tempo.",
  },
  lutea: {
    nome: "Fase lútea",
    dica: "Fase de espera. Seja gentil com você: sono de qualidade e pausas ajudam a lidar com a ansiedade.",
  },
};
