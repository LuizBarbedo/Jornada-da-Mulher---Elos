import Link from "next/link";
import { JORNADAS } from "@/lib/jornadas";

/** Carrossel horizontal com as jornadas "em breve". */
export function ProximasJornadas() {
  return (
    <ul className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-1">
      {JORNADAS.map(({ slug, titulo, destaque, icone: Icone, cor }) => (
        <li key={slug} className="snap-start">
          <Link
            href={`/em-breve/${slug}`}
            className="flex w-40 flex-col gap-4 rounded-2xl border border-borda p-4 transition-colors hover:border-grafite"
          >
            <span className={`grid size-11 place-items-center rounded-[28%] ${cor}`}>
              <Icone className="size-5" strokeWidth={1.5} />
            </span>
            <span className="flex flex-col">
              <span className="font-titulo text-sm font-light">{titulo}</span>
              <span className="font-titulo text-sm font-semibold">{destaque}</span>
            </span>
            <span className="w-fit rounded-md bg-pastel px-2 py-0.5 font-titulo text-[10px] font-semibold uppercase tracking-[0.14em]">
              Em breve
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
