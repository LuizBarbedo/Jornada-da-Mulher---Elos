import Link from "next/link";
import { Download, FileText, LogOut, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Disclaimer } from "@/components/Disclaimer";
import { ProximasJornadas } from "@/components/ProximasJornadas";
import { Sobretitulo } from "@/components/ui";
import { exigirUsuaria, getPerfil } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { hojeISO } from "@/lib/datas";
import { VERSAO_TERMO } from "@/lib/consentimento";
import { sair } from "@/app/(onboarding)/actions";
import { FormPerfil } from "./FormPerfil";
import { ApagarConta } from "./ApagarConta";

export const metadata = { title: "Perfil" };

const linha =
  "flex w-full items-center gap-4 py-4 text-left font-titulo text-sm font-semibold transition-colors hover:text-grafite/70";

export default async function PaginaPerfil() {
  const user = await exigirUsuaria();
  const perfil = (await getPerfil())!;
  const supabase = await createClient();
  const { data: consentimento } = await supabase
    .from("consent_logs")
    .select("versao_termo, aceito_em")
    .eq("user_id", user.id)
    .order("aceito_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  const aceitoEm = consentimento
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(
        new Date(consentimento.aceito_em),
      )
    : null;
  const exibicao = perfil.nome_exibicao_comunidade ?? "Você";

  return (
    <div className="flex flex-col gap-14">
      <header className="flex items-center gap-5">
        <Avatar id={user.id} nome={exibicao} tamanho="size-16 text-2xl" />
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-extralight">{perfil.nome || exibicao}</h1>
          <p className="truncate text-xs text-cinza">{user.email}</p>
          <span className="mt-2 inline-block rounded-md bg-pastel px-2 py-0.5 font-titulo text-[10px] font-semibold uppercase tracking-[0.14em]">
            Jornada: Tentante
          </span>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Sobretitulo>Seus dados</Sobretitulo>
          <h2 className="text-2xl font-light">
            Editar <span className="font-black">perfil</span>
          </h2>
        </div>
        <FormPerfil perfil={perfil} hoje={hojeISO()} />
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Sobretitulo>Próximas jornadas</Sobretitulo>
          <h2 className="text-2xl font-light">
            Vem <span className="font-black">aí</span>
          </h2>
        </div>
        <ProximasJornadas />
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 pb-2">
          <Sobretitulo>LGPD</Sobretitulo>
          <h2 className="text-2xl font-light">
            Privacidade e <span className="font-black">seus dados</span>
          </h2>
        </div>
        <div className="flex flex-col divide-y divide-borda border-y border-borda">
          <a href="/api/meus-dados" download className={linha}>
            <Download className="size-5" strokeWidth={1.5} />
            <span className="flex-1">Exportar meus dados</span>
            <span className="font-corpo text-[11px] font-normal text-cinza">JSON</span>
          </a>
          <Link href="/termos" target="_blank" className={linha}>
            <FileText className="size-5" strokeWidth={1.5} />
            <span className="flex-1">Termos de Uso e Privacidade</span>
          </Link>
          <div className="flex items-start gap-4 py-4">
            <ShieldCheck className="size-5 shrink-0" strokeWidth={1.5} />
            <p className="text-xs leading-relaxed text-grafite/75">
              {aceitoEm
                ? `Você aceitou a versão ${consentimento!.versao_termo} dos termos em ${aceitoEm}.`
                : `Versão vigente dos termos: ${VERSAO_TERMO}.`}
            </p>
          </div>
          <form action={sair}>
            <button className={linha}>
              <LogOut className="size-5" strokeWidth={1.5} />
              Sair da conta
            </button>
          </form>
        </div>
        <div className="pt-6">
          <ApagarConta />
          <p className="mt-3 text-xs leading-relaxed text-cinza">
            Apaga permanentemente sua conta e todos os seus dados. Esta ação não pode ser desfeita.
          </p>
        </div>
      </section>

      <div className="rounded-2xl bg-pastel p-5">
        <Disclaimer className="text-grafite/80" />
      </div>
    </div>
  );
}
