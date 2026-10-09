"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ehAdmin, exigirAdmin } from "@/lib/auth";
import { ehCategoria } from "@/lib/conteudo";
import { ehUUID, sanitizarTexto, texto, validarEmail } from "@/lib/validacao";
import type { EstadoForm } from "@/lib/types";

// Toda action daqui chama exigirAdmin() ANTES de usar a service role.

export async function entrarAdmin(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const email = texto(form, "email").toLowerCase();
  const senha = String(form.get("senha") ?? "");
  if (validarEmail(email) || !senha) return { erro: "Informe e-mail e senha." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: "E-mail ou senha incorretos." };
  if (!ehAdmin(data.user.email)) {
    await supabase.auth.signOut();
    return { erro: "Este e-mail não tem acesso ao painel." };
  }
  redirect("/admin");
}

export async function sairAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─── Moderação ──────────────────────────────────────────────────────

export async function restaurarPost(postId: string) {
  await exigirAdmin();
  if (!ehUUID(postId)) return;
  const db = createAdminClient();
  await db.from("post_reports").delete().eq("post_id", postId);
  await db.from("posts").update({ ativo: true, denuncias_count: 0 }).eq("id", postId);
  revalidatePath("/admin");
  revalidatePath("/comunidade");
}

export async function ocultarPost(postId: string) {
  await exigirAdmin();
  if (!ehUUID(postId)) return;
  await createAdminClient().from("posts").update({ ativo: false }).eq("id", postId);
  revalidatePath("/admin");
  revalidatePath("/comunidade");
}

export async function apagarPostDefinitivo(postId: string) {
  await exigirAdmin();
  if (!ehUUID(postId)) return;
  await createAdminClient().from("posts").delete().eq("id", postId);
  revalidatePath("/admin");
  revalidatePath("/comunidade");
}

// ─── Conteúdos ──────────────────────────────────────────────────────

const TIPOS_IMAGEM: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_IMAGEM = 5 * 1024 * 1024;

export async function salvarConteudo(id: string | null, _: EstadoForm, form: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  if (id !== null && !ehUUID(id)) return { erro: "Conteúdo inválido." };

  const titulo = sanitizarTexto(form.get("titulo"), 140);
  const categoria = texto(form, "categoria");
  const resumo = sanitizarTexto(form.get("resumo"), 300) || null;
  // O corpo aceita quebras de linha; tags HTML são removidas.
  const conteudo = sanitizarTexto(form.get("conteudo"), 50_000);
  const publicado = form.get("publicado") === "on";
  let urlImagem: string | null = texto(form, "url_imagem") || null;

  if (!titulo) return { erro: "Informe o título." };
  if (!ehCategoria(categoria)) return { erro: "Escolha uma categoria." };
  if (conteudo.length < 20) return { erro: "O texto do conteúdo está muito curto." };
  if (urlImagem && !/^https:\/\/\S+$/.test(urlImagem)) return { erro: "A URL da imagem precisa começar com https://" };

  const db = createAdminClient();

  const arquivo = form.get("imagem");
  if (arquivo instanceof File && arquivo.size > 0) {
    const ext = TIPOS_IMAGEM[arquivo.type];
    if (!ext) return { erro: "Use uma imagem JPG, PNG ou WEBP." };
    if (arquivo.size > MAX_IMAGEM) return { erro: "A imagem pode ter no máximo 5 MB." };
    const caminho = `${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from("conteudo").upload(caminho, arquivo, { contentType: arquivo.type });
    if (error) {
      console.error("admin: falha no upload", error.message);
      return { erro: "Não foi possível enviar a imagem." };
    }
    urlImagem = db.storage.from("conteudo").getPublicUrl(caminho).data.publicUrl;
  }

  const dados = { titulo, categoria, resumo, conteudo, publicado, url_imagem: urlImagem };
  const { error } = id
    ? await db.from("content_items").update(dados).eq("id", id)
    : await db.from("content_items").insert(dados);
  if (error) {
    console.error("admin: falha ao salvar conteúdo", error.code);
    return { erro: "Não foi possível salvar o conteúdo." };
  }

  revalidatePath("/admin/conteudo");
  revalidatePath("/conteudo");
  redirect("/admin/conteudo");
}

export async function alternarPublicacao(id: string, publicar: boolean) {
  await exigirAdmin();
  if (!ehUUID(id)) return;
  await createAdminClient().from("content_items").update({ publicado: publicar }).eq("id", id);
  revalidatePath("/admin/conteudo");
  revalidatePath("/conteudo");
}

export async function apagarConteudo(id: string) {
  await exigirAdmin();
  if (!ehUUID(id)) return;
  await createAdminClient().from("content_items").delete().eq("id", id);
  revalidatePath("/admin/conteudo");
  revalidatePath("/conteudo");
  redirect("/admin/conteudo");
}
