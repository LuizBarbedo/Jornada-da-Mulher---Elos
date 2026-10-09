// Moderação simples por lista de termos. Edite as listas conforme a política
// da comunidade. A comparação ignora acentos, maiúsculas, "leetspeak" básico
// (0→o, 1→i, 3→e, 4→a, @→a, $→s) e letras repetidas ("porraaaa").

/** Palavras bloqueadas somente quando aparecem inteiras (com plural). */
const PALAVRAS = [
  "porra", "caralho", "merda", "puta", "puto", "putaria", "cu", "buceta", "bosta",
  "vagabunda", "vagabundo", "vadia", "piranha", "fdp", "pqp", "vsf", "tnc",
  "idiota", "imbecil", "otaria", "otario", "babaca", "escrota", "escroto",
  "viado", "traveco", "mongoloide", "retardada", "retardado", "nojenta", "nojento", "corno", "corna",
];

/** Radicais bloqueados no início de qualquer palavra. */
const RADICAIS = ["arrombad", "desgracad", "filhadaput", "filhodaput", "fodid", "foder", "fodas", "cacete"];

/** Expressões com mais de uma palavra. */
const EXPRESSOES = ["filho da puta", "filha da puta", "vai se foder", "vai tomar no"];

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/([a-z])\1{2,}/g, "$1")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const reRadicais = new RegExp(`(?:^| )(?:${RADICAIS.join("|")})`);

/** true se o texto contém termos ofensivos da lista. */
export function contemTermoOfensivo(texto: string): boolean {
  const n = normalizar(texto);
  const palavras = n.split(" ");
  if (palavras.some((p) => PALAVRAS.includes(p) || PALAVRAS.includes(p.replace(/s$/, "")))) return true;
  if (reRadicais.test(n)) return true;
  const comEspacos = ` ${n} `;
  return EXPRESSOES.some((e) => comEspacos.includes(` ${e} `) || comEspacos.includes(` ${e}`));
}

export const MENSAGEM_MODERACAO =
  "Sua mensagem tem termos que não combinam com o nosso espaço de acolhimento. Que tal reescrever com carinho?";
