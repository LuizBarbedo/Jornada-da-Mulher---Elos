import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { LinkBotao, Quadrado, Sobretitulo } from "@/components/ui";
import { buscarJornada } from "@/lib/jornadas";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const j = buscarJornada((await params).slug);
  return { title: j ? `${j.titulo} ${j.destaque}` : "Em breve" };
}

export default async function EmBreve({ params }: { params: Promise<{ slug: string }> }) {
  const jornada = buscarJornada((await params).slug);
  if (!jornada) notFound();
  const Icone = jornada.icone;

  return (
    <div className="flex flex-col gap-10">
      <Link href="/perfil" className="flex w-fit items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em]">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Voltar
      </Link>

      {/* Composição geométrica */}
      <div aria-hidden className="relative h-56">
        <span className={`absolute left-0 top-6 grid size-36 place-items-center rounded-[28%] ${jornada.cor}`}>
          <Icone className="size-14" strokeWidth={1} />
        </span>
        <Quadrado className="absolute left-40 top-0 size-16 bg-pastel" />
        <Quadrado className="absolute left-44 top-24 size-24 border border-borda" />
        <Quadrado className="absolute right-4 top-10 size-10 bg-verde" />
        <Quadrado className="absolute bottom-0 right-16 size-6 bg-rose/80" />
      </div>

      <header className="flex flex-col gap-4">
        <Sobretitulo className="text-rose">Em breve</Sobretitulo>
        <h1 className="text-[2.8rem] font-extralight leading-[1.05] tracking-tight">
          {jornada.titulo} <span className="font-black">{jornada.destaque}</span>
        </h1>
        <p className="font-titulo text-xl font-light leading-snug">{jornada.chamada}</p>
        <p className="text-[15px] leading-relaxed text-grafite/80">{jornada.descricao}</p>
      </header>

      <ul className="flex flex-col divide-y divide-borda border-y border-borda">
        {jornada.recursos.map((r) => (
          <li key={r} className="flex items-center gap-4 py-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-[28%] bg-pastel">
              <Check className="size-4" strokeWidth={1.5} />
            </span>
            <span className="text-sm">{r}</span>
          </li>
        ))}
      </ul>

      <p className="rounded-2xl bg-pastel px-5 py-4 text-sm leading-relaxed">
        Estamos preparando esta jornada com muito cuidado. Avisaremos por aqui assim que estiver disponível.
      </p>

      <LinkBotao href="/inicio" variante="secundario">
        Voltar para o início
      </LinkBotao>
    </div>
  );
}
