import { redirect } from "next/navigation";
import { Lock, Download, Trash2, HeartHandshake } from "lucide-react";
import { ProgressoOnboarding } from "@/components/ProgressoOnboarding";
import { aceitouTermoVigente, exigirUsuaria } from "@/lib/auth";
import { VERSAO_TERMO } from "@/lib/consentimento";
import { FormConsentimento } from "./FormConsentimento";

export const metadata = { title: "Consentimento" };

const PONTOS = [
  { icone: Lock, texto: "Seus registros de ciclo, humor e sintomas são visíveis só para você." },
  { icone: HeartHandshake, texto: "Na comunidade, aparece apenas o nome de exibição que você escolher." },
  { icone: Download, texto: "Você pode baixar todos os seus dados quando quiser." },
  { icone: Trash2, texto: "Você pode apagar sua conta e todos os dados a qualquer momento." },
];

export default async function Consentimento() {
  await exigirUsuaria();
  if (await aceitouTermoVigente()) redirect("/perfil-inicial");

  return (
    <div className="flex flex-col gap-10">
      <ProgressoOnboarding etapa={3} />
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extralight leading-tight">
          Sua privacidade <span className="font-black">vem primeiro</span>
        </h1>
        <p className="text-[15px] leading-relaxed text-grafite/80">
          Dados sobre o seu ciclo são sensíveis. Por isso, pela LGPD, precisamos do seu consentimento
          claro antes de começar.
        </p>
      </header>
      <ul className="flex flex-col gap-5">
        {PONTOS.map(({ icone: Icone, texto }) => (
          <li key={texto} className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-[28%] bg-pastel">
              <Icone aria-hidden className="size-5" strokeWidth={1.5} />
            </span>
            <p className="pt-2 text-sm leading-relaxed">{texto}</p>
          </li>
        ))}
      </ul>
      <FormConsentimento />
      <p className="text-center text-[11px] text-cinza">Versão dos termos: {VERSAO_TERMO}</p>
    </div>
  );
}
