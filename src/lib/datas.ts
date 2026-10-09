// Datas de calendário são tratadas como strings "AAAA-MM-DD" (sem fuso).
// "Hoje" é sempre calculado no fuso de Brasília, inclusive no servidor (UTC).

const FUSO = "America/Sao_Paulo";
const DIA_MS = 86_400_000;

export function hojeISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date());
}

export function isoParaUTC(iso: string): number {
  const [a, m, d] = iso.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

export function utcParaISO(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function somarDias(iso: string, dias: number): string {
  return utcParaISO(isoParaUTC(iso) + dias * DIA_MS);
}

export function diferencaDias(de: string, ate: string): number {
  return Math.round((isoParaUTC(ate) - isoParaUTC(de)) / DIA_MS);
}

export function ehDataISO(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  return utcParaISO(isoParaUTC(valor)) === valor;
}

export function formatarData(iso: string, opcoes: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat("pt-BR", { ...opcoes, timeZone: "UTC" }).format(isoParaUTC(iso));
}

/** "agora", "há 5 min", "há 3 h", "ontem", "há 4 dias" ou a data. */
export function tempoRelativo(timestamp: string, agora = Date.now()): string {
  const seg = Math.max(0, Math.floor((agora - new Date(timestamp).getTime()) / 1000));
  if (seg < 60) return "agora";
  const min = Math.floor(seg / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const dias = Math.floor(h / 24);
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: FUSO }).format(new Date(timestamp));
}
