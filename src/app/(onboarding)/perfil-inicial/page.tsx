import { redirect } from "next/navigation";
import { ProgressoOnboarding } from "@/components/ProgressoOnboarding";
import { aceitouTermoVigente, exigirUsuaria, getPerfil } from "@/lib/auth";
import { hojeISO } from "@/lib/datas";
import { FormPerfilInicial } from "./FormPerfilInicial";

export const metadata = { title: "Seu ciclo" };

export default async function PerfilInicial() {
  await exigirUsuaria();
  if (!(await aceitouTermoVigente())) redirect("/consentimento");
  const perfil = await getPerfil();

  return (
    <div className="flex flex-col gap-10">
      <ProgressoOnboarding etapa={4} />
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extralight leading-tight">
          Conte um pouco <span className="font-black">sobre você</span>
        </h1>
        <p className="text-[15px] leading-relaxed text-grafite/80">
          Com essas informações, estimamos as fases do seu ciclo. Você pode ajustar tudo depois no
          seu perfil.
        </p>
      </header>
      <FormPerfilInicial
        hoje={hojeISO()}
        nome={perfil?.nome ?? ""}
        exibicao={perfil?.nome_exibicao_comunidade ?? ""}
        dum={perfil?.data_ultima_menstruacao ?? ""}
        ciclo={perfil?.duracao_ciclo_dias ?? 28}
      />
    </div>
  );
}
