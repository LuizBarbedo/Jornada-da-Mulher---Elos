import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";
import { getPerfil } from "@/lib/auth";
import { sair } from "@/app/(onboarding)/actions";

// Etapa 2: tela provisória. O rastreador entra na etapa 3.
export default async function Inicio() {
  const perfil = await getPerfil();
  return (
    <div className="flex flex-col gap-8">
      <Logo />
      <h1 className="text-4xl font-extralight leading-tight">
        Olá, <span className="font-black">{perfil?.nome || perfil?.nome_exibicao_comunidade}</span>
      </h1>
      <p className="text-sm text-grafite/80">Onboarding concluído. O rastreador chega na próxima etapa.</p>
      <form action={sair}>
        <button className="text-sm underline underline-offset-4">Sair</button>
      </form>
      <Disclaimer />
    </div>
  );
}
