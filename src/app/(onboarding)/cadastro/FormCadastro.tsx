"use client";

import { useActionState } from "react";
import { cadastrar } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso, Campo } from "@/components/ui";

export function FormCadastro() {
  const [estado, acao] = useActionState(cadastrar, undefined);

  if (estado?.sucesso) return <Aviso tipo="sucesso">{estado.sucesso}</Aviso>;

  return (
    <form action={acao} className="flex flex-col gap-6" noValidate>
      <Campo id="email" name="email" type="email" rotulo="E-mail" autoComplete="email" required placeholder="voce@email.com" />
      <Campo
        id="senha"
        name="senha"
        type="password"
        rotulo="Crie uma senha"
        autoComplete="new-password"
        required
        minLength={8}
        ajuda="Pelo menos 8 caracteres, com letras e números."
      />
      <Aviso>{estado?.erro}</Aviso>
      <BotaoEnviar textoEnviando="Criando sua conta…">Criar conta</BotaoEnviar>
    </form>
  );
}
