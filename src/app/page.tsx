import { Logo } from "@/components/Logo";
import { DISCLAIMER_MEDICO } from "@/lib/marca";

// Etapa 1: vitrine da identidade visual. Na etapa 2 vira o roteador de entrada.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-10 px-6 py-12">
      <Logo />
      <h1 className="text-5xl font-extralight leading-tight">
        Sua jornada, <span className="font-black">com cuidado.</span>
      </h1>
      <p className="text-sm leading-relaxed text-grafite/80">
        Raleway nos títulos, ABeeZee no corpo de texto. Muito respiro, sombras quase nulas e o
        quadrado arredondado como assinatura.
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          ["bg-verde", "#C0D53C"],
          ["bg-grafite", "#221F1F"],
          ["bg-pastel border border-borda", "#F0FED7"],
          ["bg-rose", "#A14252"],
          ["bg-cinza", "#999999"],
          ["bg-borda", "#D9D9D9"],
        ].map(([cls, hex]) => (
          <div key={hex} className="flex flex-col items-center gap-1">
            <div className={`size-12 rounded-[28%] ${cls}`} />
            <span className="text-[10px] text-cinza">{hex}</span>
          </div>
        ))}
      </div>
      <button className="rounded-xl bg-verde px-6 py-4 text-sm font-semibold uppercase tracking-widest">
        Começar
      </button>
      <p className="text-xs text-cinza">{DISCLAIMER_MEDICO}</p>
    </main>
  );
}
