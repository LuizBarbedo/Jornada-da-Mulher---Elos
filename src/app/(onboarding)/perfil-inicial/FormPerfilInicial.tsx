"use client";

import { useActionState, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { salvarPerfilInicial } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso, Campo } from "@/components/ui";

type Props = { hoje: string; nome: string; exibicao: string; dum: string; ciclo: number };

export function FormPerfilInicial({ hoje, nome, exibicao, dum, ciclo: cicloInicial }: Props) {
  const [estado, acao] = useActionState(salvarPerfilInicial, undefined);
  const [ciclo, setCiclo] = useState(cicloInicial);
  const ajustar = (d: number) => setCiclo((c) => Math.min(45, Math.max(21, c + d)));

  return (
    <form action={acao} className="flex flex-col gap-7" noValidate>
      <Campo
        id="data_ultima_menstruacao"
        name="data_ultima_menstruacao"
        type="date"
        rotulo="Primeiro dia da última menstruação"
        max={hoje}
        defaultValue={dum}
        required
        ajuda="Não lembra exatamente? Uma data aproximada já ajuda."
      />

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
          <p className="flex-1 text-center">
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

      <Campo
        id="nome_exibicao_comunidade"
        name="nome_exibicao_comunidade"
        rotulo="Como quer aparecer na comunidade?"
        placeholder="Ex.: Ana, Flor de Maio…"
        defaultValue={exibicao}
        maxLength={30}
        required
        ajuda="Pode ser um apelido. Ele é público para as outras participantes."
      />

      <Campo
        id="nome"
        name="nome"
        rotulo="Seu nome (opcional)"
        defaultValue={nome}
        autoComplete="given-name"
        maxLength={80}
        ajuda="Usado só para falarmos com você aqui no app."
      />

      <Aviso>{estado?.erro}</Aviso>
      <BotaoEnviar textoEnviando="Salvando…">Começar a acompanhar</BotaoEnviar>
    </form>
  );
}
