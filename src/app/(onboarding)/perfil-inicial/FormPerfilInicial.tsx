"use client";

import { useActionState } from "react";
import { salvarPerfilInicial } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CampoData } from "@/components/CampoData";
import { SeletorCiclo } from "@/components/SeletorCiclo";
import { Aviso, Campo } from "@/components/ui";

type Props = { hoje: string; nome: string; exibicao: string; dum: string; ciclo: number };

export function FormPerfilInicial({ hoje, nome, exibicao, dum, ciclo }: Props) {
  const [estado, acao] = useActionState(salvarPerfilInicial, undefined);

  return (
    <form action={acao} className="flex flex-col gap-7" noValidate>
      <CampoData
        id="data_ultima_menstruacao"
        name="data_ultima_menstruacao"
        rotulo="Primeiro dia da última menstruação"
        max={hoje}
        defaultValue={dum}
        required
        ajuda="Não lembra exatamente? Uma data aproximada já ajuda."
      />

      <SeletorCiclo inicial={ciclo} />

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
