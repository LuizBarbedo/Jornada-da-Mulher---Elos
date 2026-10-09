import Link from "next/link";
import { Capa } from "@/components/Capa";
import { Sobretitulo } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS, LISTA_CATEGORIAS, ehCategoria, minutosLeitura } from "@/lib/conteudo";
import type { Conteudo } from "@/lib/types";

export const metadata = { title: "Conteúdo" };

export default async function Biblioteca({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria: param } = await searchParams;
  const categoria = ehCategoria(param) ? param : null;

  const supabase = await createClient();
  let consulta = supabase
    .from("content_items")
    .select("id, titulo, categoria, resumo, conteudo, url_imagem, publicado, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (categoria) consulta = consulta.eq("categoria", categoria);
  const { data } = await consulta;
  const itens = (data ?? []) as Conteudo[];
  const [destaque, ...demais] = itens;

  const chip = (ativo: boolean) =>
    `shrink-0 rounded-xl border px-4 py-2 font-titulo text-xs font-semibold transition-colors ${
      ativo ? "border-grafite bg-grafite text-white" : "border-borda hover:border-grafite"
    }`;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Sobretitulo>Conteúdo</Sobretitulo>
        <h1 className="text-[2.4rem] font-extralight leading-[1.1] tracking-tight">
          Ciência com <span className="font-black">cuidado</span>
        </h1>
        <p className="text-sm leading-relaxed text-grafite/80">
          Leituras curtas e confiáveis para entender seu corpo e cuidar de você nesta fase.
        </p>
      </header>

      <nav aria-label="Categorias" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
        <Link href="/conteudo" className={chip(!categoria)} aria-current={!categoria ? "page" : undefined}>
          Tudo
        </Link>
        {LISTA_CATEGORIAS.map((c) => (
          <Link
            key={c}
            href={`/conteudo?categoria=${c}`}
            className={chip(categoria === c)}
            aria-current={categoria === c ? "page" : undefined}
          >
            {CATEGORIAS[c].nome}
          </Link>
        ))}
      </nav>

      {!destaque ? (
        <p className="py-10 text-center text-sm text-cinza">Em breve, novos conteúdos por aqui.</p>
      ) : (
        <>
          <Link href={`/conteudo/${destaque.id}`} className="group flex flex-col gap-4">
            <Capa url={destaque.url_imagem} categoria={destaque.categoria} className="aspect-[4/3] w-full rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Sobretitulo>
                {CATEGORIAS[destaque.categoria].nome} · {minutosLeitura(destaque.conteudo)} min
              </Sobretitulo>
              <h2 className="text-2xl font-light leading-snug group-hover:underline group-hover:underline-offset-4">
                {destaque.titulo}
              </h2>
              {destaque.resumo && <p className="text-sm leading-relaxed text-grafite/75">{destaque.resumo}</p>}
            </div>
          </Link>

          {demais.length > 0 && (
            <ul className="flex flex-col divide-y divide-borda border-t border-borda">
              {demais.map((item) => (
                <li key={item.id}>
                  <Link href={`/conteudo/${item.id}`} className="group flex gap-4 py-5">
                    <Capa url={item.url_imagem} categoria={item.categoria} className="size-20 shrink-0 rounded-xl" />
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <Sobretitulo>
                        {CATEGORIAS[item.categoria].nome} · {minutosLeitura(item.conteudo)} min
                      </Sobretitulo>
                      <h3 className="font-titulo text-base font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                        {item.titulo}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
