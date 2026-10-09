import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Sobretitulo } from "@/components/ui";
import { exigirUsuaria } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { tempoRelativo } from "@/lib/datas";
import { ehUUID } from "@/lib/validacao";
import type { Comentario, Post } from "@/lib/types";
import { PostCard } from "../PostCard";
import { FormComentario } from "./FormComentario";
import { apagarComentario } from "../actions";

export const metadata = { title: "Conversa" };

export default async function PaginaPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ehUUID(id)) notFound();

  const user = await exigirUsuaria();
  const supabase = await createClient();
  const [{ data: post }, { data: comentarios }, { data: denuncia }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, user_id, autor_nome, texto, created_at, ativo, denuncias_count")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("comments")
      .select("id, post_id, user_id, autor_nome, texto, created_at, ativo")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("post_reports").select("id").eq("post_id", id).eq("user_id", user.id).maybeSingle(),
  ]);

  if (!post || denuncia) notFound();
  const lista = (comentarios ?? []) as Comentario[];

  return (
    <div className="flex flex-col gap-10">
      <Link href="/comunidade" className="flex w-fit items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em]">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Comunidade
      </Link>

      <PostCard post={post as Post} minha={post.user_id === user.id} detalhe />

      <section className="flex flex-col gap-6 border-t border-borda pt-8">
        <Sobretitulo>
          {lista.length === 0 ? "Nenhum comentário ainda" : `${lista.length} ${lista.length === 1 ? "comentário" : "comentários"}`}
        </Sobretitulo>

        {lista.length > 0 && (
          <ul className="flex flex-col gap-6">
            {lista.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar id={c.user_id} nome={c.autor_nome} tamanho="size-8" />
                <div className="min-w-0 flex-1 rounded-2xl bg-pastel/60 px-4 py-3">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-titulo text-[13px] font-semibold">{c.autor_nome}</span>
                    <time dateTime={c.created_at} className="shrink-0 text-[11px] text-cinza">
                      {tempoRelativo(c.created_at)}
                    </time>
                  </p>
                  <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">{c.texto}</p>
                </div>
                {c.user_id === user.id && (
                  <form action={apagarComentario.bind(null, c.id, post.id)}>
                    <button
                      aria-label="Apagar comentário"
                      className="grid size-8 place-items-center rounded-[28%] text-cinza hover:bg-pastel hover:text-grafite"
                    >
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}

        {post.ativo && <FormComentario postId={post.id} />}
      </section>
    </div>
  );
}
