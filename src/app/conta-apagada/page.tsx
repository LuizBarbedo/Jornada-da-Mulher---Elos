import { Logo } from "@/components/Logo";
import { LinkBotao, Quadrado } from "@/components/ui";

export const metadata = { title: "Conta apagada" };

export default function ContaApagada() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-10 px-6 py-10">
      <Logo />
      <div aria-hidden className="flex gap-2.5">
        <Quadrado className="size-10 bg-pastel" />
        <Quadrado className="size-10 bg-verde" />
        <Quadrado className="size-10 bg-rose/90" />
      </div>
      <h1 className="text-4xl font-extralight leading-tight">
        Sua conta foi <span className="font-black">apagada</span>
      </h1>
      <p className="text-[15px] leading-relaxed text-grafite/80">
        Todos os seus dados foram removidos de forma permanente. Obrigada por ter caminhado com a gente até aqui.
        Desejamos muito carinho na sua jornada.
      </p>
      <LinkBotao href="/boas-vindas" variante="secundario" className="mt-auto">
        Voltar ao início
      </LinkBotao>
    </main>
  );
}
