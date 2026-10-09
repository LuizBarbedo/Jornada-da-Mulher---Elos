import Link from "next/link";
import { EyeOff, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { tempoRelativo } from "@/lib/datas";
import type { Post } from "@/lib/types";
import { MenuPost } from "./MenuPost";

type Props = {
  post: Post;
  minha: boolean;
  comentarios?: number;
  /** Na tela do post, o texto não é link e o contador não aparece. */
  detalhe?: boolean;
};

export function PostCard({ post, minha, comentarios = 0, detalhe = false }: Props) {
  return (
    <article className="flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <Avatar id={post.user_id} nome={post.autor_nome} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-titulo text-sm font-semibold">
            {post.autor_nome}
            {minha && <span className="ml-2 font-normal text-cinza">(você)</span>}
          </p>
          <p className="text-[11px] text-cinza">
            <time dateTime={post.created_at}>{tempoRelativo(post.created_at)}</time>
          </p>
        </div>
        <MenuPost postId={post.id} minha={minha} />
      </header>

      {!post.ativo && (
        <p className="flex items-center gap-2 rounded-xl bg-rose/10 px-3 py-2 text-xs text-rose">
          <EyeOff className="size-3.5" strokeWidth={1.5} />
          Oculto pela moderação. Só você está vendo.
        </p>
      )}

      {detalhe ? (
        <p className="whitespace-pre-line break-words text-[17px] leading-relaxed">{post.texto}</p>
      ) : (
        <Link href={`/comunidade/${post.id}`} className="whitespace-pre-line break-words text-[15px] leading-relaxed">
          {post.texto}
        </Link>
      )}

      {!detalhe && (
        <Link
          href={`/comunidade/${post.id}`}
          className="flex w-fit items-center gap-2 font-titulo text-[11px] font-semibold uppercase tracking-[0.14em] text-grafite/70 hover:text-grafite"
        >
          <MessageCircle className="size-4" strokeWidth={1.5} />
          {comentarios === 0 ? "Comentar" : comentarios === 1 ? "1 comentário" : `${comentarios} comentários`}
        </Link>
      )}
    </article>
  );
}
