import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Sobretitulo } from "@/components/ui";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { tempoRelativo } from "@/lib/datas";
import type { Post } from "@/lib/types";
import { apagarPostDefinitivo, ocultarPost, restaurarPost } from "../actions";

export const metadata = { title: "Moderação" };

type PostModeracao = Post & { post_reports: { motivo: string | null }[] };

const botao =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-titulo text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors";

export default async function Moderacao() {
  await exigirAdmin();
  const db = createAdminClient();
  const campos = "id, user_id, autor_nome, texto, created_at, ativo, denuncias_count, post_reports(motivo)";

  const [{ data: pendentes }, { data: recentes }] = await Promise.all([
    db.from("posts").select(campos).or("ativo.eq.false,denuncias_count.gt.0").order("created_at", { ascending: false }),
    db.from("posts").select(campos).eq("ativo", true).eq("denuncias_count", 0).order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Sobretitulo>Fila de moderação</Sobretitulo>
          <h1 className="text-3xl font-extralight">
            Denunciados e <span className="font-black">ocultos</span>
          </h1>
        </header>
        <ListaPosts posts={(pendentes ?? []) as PostModeracao[]} vazio="Nada pendente. A comunidade está tranquila." />
      </section>

      <section className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Sobretitulo>Últimos 20 posts ativos</Sobretitulo>
          <h2 className="text-2xl font-extralight">Publicações recentes</h2>
        </header>
        <ListaPosts posts={(recentes ?? []) as PostModeracao[]} vazio="Nenhum post publicado ainda." />
      </section>
    </div>
  );
}

function ListaPosts({ posts, vazio }: { posts: PostModeracao[]; vazio: string }) {
  if (posts.length === 0) return <p className="rounded-2xl bg-pastel px-5 py-4 text-sm">{vazio}</p>;

  return (
    <ul className="flex flex-col divide-y divide-borda border-y border-borda">
      {posts.map((p) => {
        const motivos = Object.entries(
          p.post_reports.reduce<Record<string, number>>((acc, r) => {
            const m = r.motivo ?? "Sem motivo";
            acc[m] = (acc[m] ?? 0) + 1;
            return acc;
          }, {}),
        );
        return (
          <li key={p.id} className="flex flex-col gap-3 py-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-titulo font-semibold">{p.autor_nome}</span>
              <span className="text-cinza">· {tempoRelativo(p.created_at)}</span>
              {p.ativo ? (
                <span className="rounded-md bg-pastel px-2 py-0.5">Visível</span>
              ) : (
                <span className="rounded-md bg-rose/10 px-2 py-0.5 text-rose">Oculto</span>
              )}
              {p.denuncias_count > 0 && (
                <span className="rounded-md bg-rose px-2 py-0.5 text-white">
                  {p.denuncias_count} {p.denuncias_count === 1 ? "denúncia" : "denúncias"}
                </span>
              )}
            </div>
            <p className="whitespace-pre-line break-words text-sm leading-relaxed">{p.texto}</p>
            {motivos.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {motivos.map(([m, n]) => (
                  <li key={m} className="rounded-md border border-borda px-2 py-1 text-[11px] text-grafite/80">
                    {m} ({n})
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              {(!p.ativo || p.denuncias_count > 0) && (
                <form action={restaurarPost.bind(null, p.id)}>
                  <button className={`${botao} border-grafite hover:bg-grafite hover:text-white`}>
                    <Eye className="size-3.5" strokeWidth={1.5} />
                    Restaurar e limpar denúncias
                  </button>
                </form>
              )}
              {p.ativo && (
                <form action={ocultarPost.bind(null, p.id)}>
                  <button className={`${botao} border-rose text-rose hover:bg-rose hover:text-white`}>
                    <EyeOff className="size-3.5" strokeWidth={1.5} />
                    Ocultar
                  </button>
                </form>
              )}
              <form action={apagarPostDefinitivo.bind(null, p.id)}>
                <button className={`${botao} border-borda text-cinza hover:border-rose hover:text-rose`}>
                  <Trash2 className="size-3.5" strokeWidth={1.5} />
                  Apagar
                </button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
