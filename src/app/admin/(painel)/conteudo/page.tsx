import Link from "next/link";
import { Plus } from "lucide-react";
import { Capa } from "@/components/Capa";
import { LinkBotao, Sobretitulo } from "@/components/ui";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORIAS } from "@/lib/conteudo";
import type { Conteudo } from "@/lib/types";
import { alternarPublicacao } from "../../actions";

export const metadata = { title: "Conteúdos" };

export default async function ConteudosAdmin() {
  await exigirAdmin();
  const { data } = await createAdminClient()
    .from("content_items")
    .select("*")
    .order("updated_at", { ascending: false });
  const itens = (data ?? []) as Conteudo[];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Sobretitulo>{itens.length} conteúdos</Sobretitulo>
          <h1 className="text-3xl font-extralight">
            Biblioteca de <span className="font-black">conteúdos</span>
          </h1>
        </div>
        <LinkBotao href="/admin/conteudo/novo" className="px-5 py-3">
          <Plus className="size-4" strokeWidth={2} />
          Novo
        </LinkBotao>
      </header>

      {itens.length === 0 ? (
        <p className="rounded-2xl bg-pastel px-5 py-4 text-sm">Nenhum conteúdo ainda. Crie o primeiro.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-borda border-y border-borda">
          {itens.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <Capa url={item.url_imagem} categoria={item.categoria} className="size-14 shrink-0 rounded-xl" />
              <Link href={`/admin/conteudo/${item.id}`} className="min-w-0 flex-1">
                <p className="text-[11px] text-cinza">{CATEGORIAS[item.categoria].nome}</p>
                <p className="truncate font-titulo text-sm font-semibold hover:underline">{item.titulo}</p>
              </Link>
              <form action={alternarPublicacao.bind(null, item.id, !item.publicado)}>
                <button
                  title={item.publicado ? "Clique para despublicar" : "Clique para publicar"}
                  className={`rounded-lg px-3 py-1.5 font-titulo text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    item.publicado ? "bg-verde text-grafite" : "border border-borda text-cinza hover:border-grafite"
                  }`}
                >
                  {item.publicado ? "Publicado" : "Rascunho"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
