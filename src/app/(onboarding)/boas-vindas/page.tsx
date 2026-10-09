import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";
import { ProgressoOnboarding } from "@/components/ProgressoOnboarding";
import { LinkBotao, Quadrado } from "@/components/ui";

export const metadata = { title: "Boas-vindas" };

export default function BoasVindas() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="flex items-center justify-between">
        <Logo />
      </header>

      {/* Composição geométrica: o quadrado arredondado da marca */}
      <div aria-hidden className="grid w-fit grid-cols-4 gap-2.5 self-end">
        <Quadrado className="size-14 bg-pastel" />
        <Quadrado className="size-14 bg-verde" />
        <Quadrado className="size-14" />
        <Quadrado className="size-14 bg-pastel" />
        <Quadrado className="size-14" />
        <Quadrado className="size-14 bg-grafite" />
        <Quadrado className="size-14 bg-verde" />
        <Quadrado className="size-14 bg-rose/90" />
        <Quadrado className="size-14 bg-pastel" />
        <Quadrado className="size-14" />
        <Quadrado className="size-14 bg-pastel" />
        <Quadrado className="size-14 bg-verde" />
      </div>

      <section className="flex flex-col gap-6">
        <ProgressoOnboarding etapa={1} />
        <h1 className="text-[2.6rem] font-extralight leading-[1.08] tracking-tight">
          Cada ciclo é <span className="font-black">um passo</span> da sua história.
        </h1>
        <p className="text-[15px] leading-relaxed text-grafite/80">
          Que bom ter você aqui. Este é um espaço para acompanhar seu ciclo com leveza, encontrar
          conteúdo confiável e se sentir acompanhada por quem vive a mesma jornada.
        </p>
      </section>

      <div className="mt-auto flex flex-col gap-3">
        <LinkBotao href="/cadastro">Começar minha jornada</LinkBotao>
        <LinkBotao href="/entrar" variante="fantasma">
          Já tenho conta
        </LinkBotao>
        <Disclaimer className="mt-4 justify-center" />
      </div>
    </div>
  );
}
