"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirUsuaria } from "@/lib/auth";
import { contemTermoOfensivo, MENSAGEM_MODERACAO } from "@/lib/moderacao";
import { ehUUID, sanitizarTexto } from "@/lib/validacao";
import type { EstadoForm } from "@/lib/types";
import { MOTIVOS_DENUNCIA } from "@/lib/comunidade";

const LIMITE_POSTS_POR_HORA = 10;
const LIMITE_COMENTARIOS_POR_HORA = 30;

async function excedeuLimite(tabela: "posts" | "comments", userId: string, limite: number) {
  const supabase = await createClient();
  const umaHoraAtras = new Date(Date.now() - 3_600_000).toISOString();
  const { count } = await supabase
    .from(tabela)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", umaHoraAtras);
  return (count ?? 0) >= limite;
}

function validarMensagem(entrada: FormDataEntryValue | null, max: number): { texto?: string; erro?: string } {
  const texto = sanitizarTexto(entrada, max);
  if (texto.length < 2) return { erro: "Escreva um pouco mais antes de publicar." };
  if (contemTermoOfensivo(texto)) return { erro: MENSAGEM_MODERACAO };
  return { texto };
}

export async function criarPost(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  const { texto, erro } = validarMensagem(form.get("texto"), 1000);
  if (erro) return { erro };
  if (await excedeuLimite("posts", user.id, LIMITE_POSTS_POR_HORA)) {
    return { erro: "Você publicou bastante na última hora. Tente novamente daqui a pouco." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({ user_id: user.id, texto });
  if (error) {
    console.error("comunidade: falha ao publicar", error.code);
    return { erro: "Não conseguimos publicar agora. Tente novamente." };
  }
  revalidatePath("/comunidade");
  return { sucesso: "Publicado. Obrigada por compartilhar." };
}

export async function apagarPost(postId: string) {
  if (!ehUUID(postId)) return;
  await exigirUsuaria();
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", postId); // RLS: só a autora
  revalidatePath("/comunidade");
  redirect("/comunidade");
}

export async function denunciarPost(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  const postId = form.get("post_id");
  const motivo = String(form.get("motivo") ?? "");
  if (!ehUUID(postId)) return { erro: "Post inválido." };
  if (!(MOTIVOS_DENUNCIA as readonly string[]).includes(motivo)) return { erro: "Escolha um motivo." };

  const supabase = await createClient();
  const { error } = await supabase.from("post_reports").insert({ user_id: user.id, post_id: postId, motivo });
  // 23505 = já denunciado por esta usuária; tratamos como sucesso.
  if (error && error.code !== "23505") {
    console.error("comunidade: falha ao denunciar", error.code);
    return { erro: "Não conseguimos registrar a denúncia. Tente novamente." };
  }
  // Sem revalidatePath: o feed é atualizado quando o painel fecha (MenuPost),
  // para a usuária conseguir ler a confirmação.
  return { sucesso: "Obrigada por avisar. Este post não aparecerá mais para você e será revisado pela equipe." };
}

export async function comentar(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  const postId = form.get("post_id");
  if (!ehUUID(postId)) return { erro: "Post inválido." };
  const { texto, erro } = validarMensagem(form.get("texto"), 500);
  if (erro) return { erro };
  if (await excedeuLimite("comments", user.id, LIMITE_COMENTARIOS_POR_HORA)) {
    return { erro: "Muitos comentários na última hora. Respire e volte daqui a pouco." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({ user_id: user.id, post_id: postId, texto });
  if (error) {
    console.error("comunidade: falha ao comentar", error.code);
    return { erro: "Não conseguimos comentar agora. Este post pode ter sido ocultado." };
  }
  revalidatePath(`/comunidade/${postId}`);
  return { sucesso: "Comentário enviado." };
}

export async function apagarComentario(comentarioId: string, postId: string) {
  if (!ehUUID(comentarioId) || !ehUUID(postId)) return;
  await exigirUsuaria();
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", comentarioId); // RLS: só a autora
  revalidatePath(`/comunidade/${postId}`);
}
