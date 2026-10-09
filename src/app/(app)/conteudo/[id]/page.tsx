import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Capa } from "@/components/Capa";
import { Disclaimer } from "@/components/Disclaimer";
import { Sobretitulo } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS, minutosLeitura, renderizarCorpo } from "@/lib/conteudo";
import { ehUUID } from "@/lib/validacao";
import type { Conteudo } from "@/lib/types";

async function buscar(id: string) {
  if (!ehUUID(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("content_items").select("*").eq("id", id).maybeSingle();
  return data as Conteudo | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const item = await buscar((await params).id);
  return { title: item?.titulo ?? "Conteúdo" };
}

export default async function Leitura({ params }: { params: Promise<{ id: string }> }) {
  const item = await buscar((await params).id);
  if (!item) notFound();
  const categoria = CATEGORIAS[item.categoria];

  return (
    <article className="flex flex-col gap-8">
      <Link
        href={`/conteudo?categoria=${item.categoria}`}
        className="flex w-fit items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em]"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        {categoria.nome}
      </Link>

      <header className="flex flex-col gap-4">
        <Sobretitulo>
          {categoria.nome} · {minutosLeitura(item.conteudo)} min de leitura
        </Sobretitulo>
        <h1 className="text-[2.2rem] font-extralight leading-[1.12] tracking-tight">{item.titulo}</h1>
        {item.resumo && <p className="text-[17px] leading-relaxed text-grafite/75">{item.resumo}</p>}
      </header>

      <Capa url={item.url_imagem} categoria={item.categoria} className="-mx-6 aspect-[4/3] w-[calc(100%+3rem)]" />

      <div className="leitura text-[17px] leading-[1.75] text-grafite/90">{renderizarCorpo(item.conteudo)}</div>

      <div className="flex flex-col gap-4 border-t border-borda pt-6">
        <Disclaimer />
        <Link href="/conteudo" className="font-titulo text-xs font-semibold uppercase tracking-[0.16em] underline underline-offset-4">
          Ver mais conteúdos
        </Link>
      </div>
    </article>
  );
}
