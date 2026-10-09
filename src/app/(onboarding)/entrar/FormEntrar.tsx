"use client";

import { useActionState } from "react";
import { entrar } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso, Campo } from "@/components/ui";

export function FormEntrar({ acao = entrar }: { acao?: typeof entrar }) {
  const [estado, enviar] = useActionState(acao, undefined);
  return (
    <form action={enviar} className="flex flex-col gap-6" noValidate>
      <Campo id="email" name="email" type="email" rotulo="E-mail" autoComplete="email" required />
      <Campo id="senha" name="senha" type="password" rotulo="Senha" autoComplete="current-password" required />
      <Aviso>{estado?.erro}</Aviso>
      <BotaoEnviar textoEnviando="Entrando…">Entrar</BotaoEnviar>
    </form>
  );
}
