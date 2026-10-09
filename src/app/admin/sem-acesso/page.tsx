import { Logo } from "@/components/Logo";
import { Botao, LinkBotao } from "@/components/ui";
import { sairAdmin } from "../actions";

export const metadata = { title: "Sem acesso" };

export default function SemAcesso() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 px-6 py-10">
      <Logo />
      <h1 className="text-4xl font-extralight">
        Este painel é <span className="font-black">restrito</span>
      </h1>
      <p className="text-sm leading-relaxed text-grafite/80">
        Sua conta não está na lista de administradoras. Se acha que isso é um engano, fale com a equipe responsável.
      </p>
      <div className="flex flex-col gap-3">
        <LinkBotao href="/inicio">Voltar ao app</LinkBotao>
        <form action={sairAdmin} className="flex flex-col">
          <Botao variante="fantasma">Entrar com outra conta</Botao>
        </form>
      </div>
    </main>
  );
}
