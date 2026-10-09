import { gerarIcone } from "@/lib/icone";

const TAMANHOS = [192, 512];

/** Ícones PNG do manifest: /icone/192 e /icone/512 */
export async function GET(_: Request, { params }: { params: Promise<{ tamanho: string }> }) {
  const tamanho = Number((await params).tamanho);
  if (!TAMANHOS.includes(tamanho)) return new Response("Não encontrado", { status: 404 });
  const resposta = gerarIcone(tamanho);
  resposta.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return resposta;
}
