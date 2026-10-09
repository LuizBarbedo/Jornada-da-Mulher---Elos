"use client";

import { useActionState } from "react";
import { atualizarPerfil } from "./actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { CampoData } from "@/components/CampoData";
import { SeletorCiclo } from "@/components/SeletorCiclo";
import { Aviso, Campo } from "@/components/ui";
import type { Perfil } from "@/lib/types";

export function FormPerfil({ perfil, hoje }: { perfil: Perfil; hoje: string }) {
  const [estado, acao] = useActionState(atualizarPerfil, undefined);

  return (
    <form action={acao} className="flex flex-col gap-7" noValidate>
      <Campo id="nome" name="nome" rotulo="Seu nome" defaultValue={perfil.nome ?? ""} maxLength={80} autoComplete="given-name" />
      <Campo
        id="nome_exibicao_comunidade"
        name="nome_exibicao_comunidade"
        rotulo="Nome na comunidade"
        defaultValue={perfil.nome_exibicao_comunidade ?? ""}
        maxLength={30}
        required
        ajuda="Ao trocar, seus posts e comentários antigos passam a mostrar o novo nome."
      />
      <CampoData
        id="data_nascimento"
        name="data_nascimento"
        rotulo="Data de nascimento (opcional)"
        defaultValue={perfil.data_nascimento ?? ""}
        max={hoje}
      />
      <CampoData
        id="data_ultima_menstruacao"
        name="data_ultima_menstruacao"
        rotulo="Primeiro dia da última menstruação"
        defaultValue={perfil.data_ultima_menstruacao ?? ""}
        max={hoje}
        required
      />
      <SeletorCiclo inicial={perfil.duracao_ciclo_dias} />

      {estado?.erro && <Aviso>{estado.erro}</Aviso>}
      {estado?.sucesso && <Aviso tipo="sucesso">{estado.sucesso}</Aviso>}
      <BotaoEnviar variante="secundario" textoEnviando="Salvando…">
        Salvar alterações
      </BotaoEnviar>
    </form>
  );
}
