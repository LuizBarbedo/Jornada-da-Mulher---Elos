import { HeartHandshake } from "lucide-react";
import { Sobretitulo } from "@/components/ui";
import { exigirUsuaria } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { NovoPost } from "./NovoPost";
import { PostCard } from "./PostCard";

export const metadata = { title: "Comunidade" };

const LIMITE_FEED = 50;

type PostComContagem = Post & { comments: { count: number }[] };

export default async function Comunidade() {
  const user = await exigirUsuaria();
  const supabase = await createClient();

  const [{ data: posts }, { data: denuncias }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, user_id, autor_nome, texto, created_at, ativo, denuncias_count, comments(count)")
      .order("created_at", { ascending: false })
      .limit(LIMITE_FEED),
    supabase.from("post_reports").select("post_id").eq("user_id", user.id),
  ]);

  const denunciados = new Set((denuncias ?? []).map((d) => d.post_id));
  const feed = ((posts ?? []) as PostComContagem[]).filter((p) => !denunciados.has(p.id));

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Sobretitulo>Comunidade</Sobretitulo>
        <h1 className="text-[2.4rem] font-extralight leading-[1.1] tracking-tight">
          Você não está <span className="font-black">sozinha</span>
        </h1>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-rose">
          <HeartHandshake className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
          Um espaço de troca e acolhimento. Seja gentil: do outro lado tem alguém vivendo a mesma espera.
        </p>
      </header>

      <NovoPost />

      {feed.length === 0 ? (
        <p className="py-10 text-center text-sm text-cinza">
          Ainda não há conversas por aqui. Que tal começar a primeira?
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-borda">
          {feed.map((p) => (
            <li key={p.id} className="py-7 first:pt-0">
              <PostCard post={p} minha={p.user_id === user.id} comentarios={p.comments[0]?.count ?? 0} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-[11px] leading-relaxed text-cinza">
        Relatos da comunidade são experiências pessoais e não substituem orientação médica.
      </p>
    </div>
  );
}
