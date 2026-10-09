"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

/** Duração do ciclo (21–45 dias) com botões − / +. Envia `duracao_ciclo_dias`. */
export function SeletorCiclo({ inicial = 28 }: { inicial?: number }) {
  const [ciclo, setCiclo] = useState(inicial);
  const ajustar = (d: number) => setCiclo((c) => Math.min(45, Math.max(21, c + d)));

  return (
    <div className="flex flex-col gap-2">
      <span id="rotulo-ciclo" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
        Duração média do ciclo
      </span>
      <div className="flex items-center gap-4 rounded-xl border border-borda p-2" role="group" aria-labelledby="rotulo-ciclo">
        <button
          type="button"
          onClick={() => ajustar(-1)}
          aria-label="Diminuir um dia"
          className="grid size-11 place-items-center rounded-[28%] bg-pastel"
        >
          <Minus className="size-4" strokeWidth={1.5} />
        </button>
        <p className="flex-1 text-center" aria-live="polite">
          <span className="font-titulo text-3xl font-light">{ciclo}</span>
          <span className="ml-1 text-sm text-cinza">dias</span>
        </p>
        <button
          type="button"
          onClick={() => ajustar(1)}
          aria-label="Aumentar um dia"
          className="grid size-11 place-items-center rounded-[28%] bg-pastel"
        >
          <Plus className="size-4" strokeWidth={1.5} />
        </button>
        <input type="hidden" name="duracao_ciclo_dias" value={ciclo} />
      </div>
      <p className="text-xs leading-relaxed text-cinza">
        Do primeiro dia de uma menstruação até o dia anterior à próxima. Se não souber, 28 é a média.
      </p>
    </div>
  );
}
