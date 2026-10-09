import { diferencaDias, ehDataISO, hojeISO } from "./datas";

/**
 * Remove tags HTML, caracteres de controle e espaços excessivos.
 * O React já escapa a saída; isto é uma camada extra contra lixo e abuso.
 */
export function sanitizarTexto(entrada: unknown, max: number): string {
  if (typeof entrada !== "string") return "";
  return entrada
    .normalize("NFC")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function texto(form: FormData, campo: string): string {
  const v = form.get(campo);
  return typeof v === "string" ? v.trim() : "";
}

export function validarEmail(email: string): string | null {
  if (!email) return "Informe seu e-mail.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Este e-mail não parece válido.";
  return null;
}

export function validarSenha(senha: string): string | null {
  if (senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
  if (senha.length > 72) return "A senha pode ter no máximo 72 caracteres.";
  if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) return "Use letras e números na senha.";
  return null;
}

export function validarDUM(valor: string): string | null {
  if (!ehDataISO(valor)) return "Informe a data da última menstruação.";
  const dias = diferencaDias(valor, hojeISO());
  if (dias < 0) return "A data não pode estar no futuro.";
  if (dias > 365) return "Use uma data dos últimos 12 meses.";
  return null;
}

export function validarDuracaoCiclo(valor: string): { valor?: number; erro?: string } {
  const n = Number(valor);
  if (!Number.isInteger(n) || n < 21 || n > 45) {
    return { erro: "A duração do ciclo deve ficar entre 21 e 45 dias." };
  }
  return { valor: n };
}

export function validarNomeExibicao(valor: string): { valor?: string; erro?: string } {
  const limpo = sanitizarTexto(valor, 30);
  if (limpo.length < 2) return { erro: "O nome de exibição precisa ter de 2 a 30 caracteres." };
  return { valor: limpo };
}

export function validarNascimento(valor: string): { valor?: string | null; erro?: string } {
  if (!valor) return { valor: null };
  if (!ehDataISO(valor)) return { erro: "Data de nascimento inválida." };
  const anos = diferencaDias(valor, hojeISO()) / 365.25;
  if (anos < 12 || anos > 70) return { erro: "Confira a data de nascimento." };
  return { valor };
}
