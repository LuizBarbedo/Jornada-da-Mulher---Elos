"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { infoDoDia, type Fase } from "@/lib/ciclo";
import { somarDias } from "@/lib/datas";
import type { TipoRegistro } from "@/lib/types";

type Props = {
  hoje: string;
  dum: string;
  duracao: number;
  /** data ISO → tipos registrados naquele dia */
  registros: Record<string, TipoRegistro[]>;
};

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const ESTILO_FASE: Record<Fase, string> = {
  menstrual: "bg-rose text-white",
  fertil: "bg-verde text-grafite",
  ovulacao: "bg-verde text-grafite ring-2 ring-grafite ring-inset font-semibold",
  lutea: "bg-pastel text-grafite",
  folicular: "text-grafite",
};

const LEGENDA: { fase: Fase; rotulo: string; cor: string }[] = [
  { fase: "menstrual", rotulo: "Menstrual", cor: "bg-rose" },
  { fase: "fertil", rotulo: "Fértil", cor: "bg-verde" },
  { fase: "ovulacao", rotulo: "Ovulação", cor: "bg-verde ring-2 ring-grafite ring-inset" },
  { fase: "lutea", rotulo: "Lútea", cor: "bg-pastel border border-borda" },
];

const COR_PONTO: Record<TipoRegistro, string> = {
  menstruacao: "bg-rose",
  humor: "bg-grafite",
  sintoma: "bg-cinza",
  observacao: "bg-borda",
};

function iso(ano: number, mes: number, dia: number) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function Calendario({ hoje, dum, duracao, registros }: Props) {
  const [anoHoje, mesHoje] = hoje.split("-").map(Number);
  const [cursor, setCursor] = useState({ ano: anoHoje, mes: mesHoje - 1 });

  const primeiro = iso(cursor.ano, cursor.mes, 1);
  const diasNoMes = new Date(Date.UTC(cursor.ano, cursor.mes + 1, 0)).getUTCDate();
  const deslocamento = new Date(Date.UTC(cursor.ano, cursor.mes, 1)).getUTCDay();
  const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(cursor.ano, cursor.mes, 1),
  );

  const mudarMes = (delta: number) =>
    setCursor(({ ano, mes }) => {
      const d = new Date(Date.UTC(ano, mes + delta, 1));
      return { ano: d.getUTCFullYear(), mes: d.getUTCMonth() };
    });

  return (
    <section aria-label="Calendário do ciclo" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light capitalize">{nomeMes}</h2>
        <div className="flex gap-1">
          <button onClick={() => mudarMes(-1)} aria-label="Mês anterior" className="grid size-9 place-items-center rounded-[28%] hover:bg-pastel">
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>
          <button onClick={() => mudarMes(1)} aria-label="Próximo mês" className="grid size-9 place-items-center rounded-[28%] hover:bg-pastel">
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="pb-1 font-titulo text-[10px] font-semibold uppercase tracking-widest text-cinza">
            {d}
          </span>
        ))}
        {Array.from({ length: deslocamento }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: diasNoMes }, (_, i) => {
          const data = somarDias(primeiro, i);
          const info = infoDoDia(data, dum, duracao);
          const tipos = registros[data] ?? [];
          const ehHoje = data === hoje;
          const futuro = data > hoje;
          return (
            <div key={data} className="flex flex-col items-center gap-1">
              <span
                aria-label={`${i + 1}${info ? `, ${info.fase}` : ""}${ehHoje ? ", hoje" : ""}`}
                className={`grid size-9 place-items-center rounded-[28%] font-titulo text-sm ${
                  info ? ESTILO_FASE[info.fase] : "text-cinza"
                } ${futuro && info ? "opacity-60" : ""} ${ehHoje ? "outline-2 outline-offset-2 outline-grafite" : ""}`}
              >
                {i + 1}
              </span>
              <span className="flex h-1.5 gap-0.5">
                {[...new Set(tipos)].slice(0, 3).map((t) => (
                  <span key={t} className={`size-1.5 rounded-[28%] ${COR_PONTO[t]}`} />
                ))}
              </span>
            </div>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {LEGENDA.map(({ fase, rotulo, cor }) => (
          <li key={fase} className="flex items-center gap-1.5 text-[11px] text-grafite/80">
            <span className={`size-3 rounded-[28%] ${cor}`} />
            {rotulo}
          </li>
        ))}
        <li className="text-[11px] text-cinza">Dias futuros são previsões.</li>
      </ul>
    </section>
  );
}
