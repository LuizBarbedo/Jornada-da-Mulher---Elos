import { Trash2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";
import { ProximasJornadas } from "@/components/ProximasJornadas";
import { Quadrado, Sobretitulo } from "@/components/ui";
import { getPerfil } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatarData, hojeISO, somarDias } from "@/lib/datas";
import { FASES, infoDoDia, previsoes, type Fase } from "@/lib/ciclo";
import { OPCOES } from "@/lib/registros";
import type { RegistroCiclo, TipoRegistro } from "@/lib/types";
import { Calendario } from "./Calendario";
import { RegistroRapido } from "./RegistroRapido";
import { apagarRegistro } from "./actions";

export const metadata = { title: "Início" };

const CARD_FASE: Record<Fase, string> = {
  menstrual: "bg-rose text-white",
  folicular: "bg-pastel",
  fertil: "bg-verde",
  ovulacao: "bg-verde",
  lutea: "bg-pastel",
};

export default async function Inicio() {
  // O layout do app já garante perfil completo (DUM preenchida).
  const perfil = (await getPerfil())!;
  const hoje = hojeISO();
  const dum = perfil.data_ultima_menstruacao!;
  const duracao = perfil.duracao_ciclo_dias;

  const supabase = await createClient();
  const { data } = await supabase
    .from("cycle_logs")
    .select("id, data, tipo, valor, texto_livre, created_at")
    .gte("data", somarDias(hoje, -180))
    .order("created_at", { ascending: false });
  const logs = (data ?? []) as RegistroCiclo[];

  const porDia: Record<string, TipoRegistro[]> = {};
  for (const l of logs) (porDia[l.data] ??= []).push(l.tipo);
  const deHoje = logs.filter((l) => l.data === hoje);

  const info = infoDoDia(hoje, dum, duracao) ?? { fase: "folicular" as const, diaCiclo: 1 };
  const fase = FASES[info.fase];
  const prev = previsoes(hoje, dum, duracao);
  const nome = perfil.nome || perfil.nome_exibicao_comunidade;
  const quando =
    prev.diasAteProxima === 0 ? "hoje" : prev.diasAteProxima === 1 ? "amanhã" : `em ${prev.diasAteProxima} dias`;

  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-center justify-between">
        <Logo />
        <p className="font-titulo text-[11px] font-semibold uppercase tracking-[0.18em] text-cinza">
          {formatarData(hoje, { weekday: "short", day: "numeric", month: "short" })}
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h1 className="text-[2.4rem] font-extralight leading-[1.1] tracking-tight">
          Olá, <span className="font-black">{nome}</span>
        </h1>
        <p className="text-[15px] text-grafite/80">Como você está se sentindo hoje?</p>
      </section>

      {/* Fase atual */}
      <section className={`relative overflow-hidden rounded-2xl p-6 ${CARD_FASE[info.fase]}`}>
        <Quadrado className="absolute -right-6 -top-6 size-28 bg-white/25" />
        <Quadrado className="absolute right-10 top-14 size-8 bg-white/25" />
        <p className="relative font-titulo text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">
          Dia {info.diaCiclo} do ciclo
        </p>
        <h2 className="relative mt-2 text-3xl font-light">{fase.nome}</h2>
        <p className="relative mt-4 text-sm leading-relaxed opacity-90">{fase.dica}</p>
      </section>

      {/* Previsões */}
      <section className="grid grid-cols-2 divide-x divide-borda border-y border-borda">
        <div className="flex flex-col gap-1 py-5 pr-4">
          <Sobretitulo>Próxima menstruação</Sobretitulo>
          <p className="font-titulo text-2xl font-light">{quando}</p>
          <p className="text-xs text-cinza">{formatarData(prev.proximaMenstruacao)}</p>
        </div>
        <div className="flex flex-col gap-1 py-5 pl-4">
          <Sobretitulo>Janela fértil</Sobretitulo>
          <p className="font-titulo text-2xl font-light">
            {formatarData(prev.janelaFertil.inicio, { day: "numeric" })}–
            {formatarData(prev.janelaFertil.fim, { day: "numeric", month: "short" })}
          </p>
          <p className="text-xs text-cinza">estimativa deste ciclo</p>
        </div>
      </section>

      {/* Registro rápido */}
      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-light">
          Registrar <span className="font-black">hoje</span>
        </h2>
        <RegistroRapido />

        {deHoje.length > 0 && (
          <ul className="flex flex-col divide-y divide-borda rounded-2xl border border-borda">
            {deHoje.map((l) => (
              <li key={l.id} className="flex items-start gap-3 px-4 py-3.5">
                <span
                  className={`mt-1.5 size-2.5 shrink-0 rounded-[28%] ${
                    l.tipo === "menstruacao" || l.tipo === "humor" ? "bg-rose" : "bg-verde"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-titulo font-semibold">{OPCOES[l.tipo].titulo}</span>
                    {l.valor && <> · {l.valor}</>}
                  </p>
                  {l.texto_livre && (
                    <p className="mt-0.5 break-words text-xs leading-relaxed text-grafite/70">{l.texto_livre}</p>
                  )}
                </div>
                <form action={apagarRegistro.bind(null, l.id)}>
                  <button
                    aria-label="Apagar registro"
                    className="grid size-8 place-items-center rounded-[28%] text-cinza hover:bg-pastel hover:text-grafite"
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Calendario hoje={hoje} dum={dum} duracao={duracao} registros={porDia} />

      <section className="flex flex-col gap-5">
        <h2 className="text-2xl font-light">
          Próximas <span className="font-black">jornadas</span>
        </h2>
        <ProximasJornadas />
      </section>

      <Disclaimer />
    </div>
  );
}
