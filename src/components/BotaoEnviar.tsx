"use client";

import { useFormStatus } from "react-dom";
import { Botao } from "./ui";
import type { ComponentProps } from "react";

export function BotaoEnviar({
  children,
  textoEnviando = "Aguarde…",
  ...props
}: ComponentProps<typeof Botao> & { textoEnviando?: string }) {
  const { pending } = useFormStatus();
  return (
    <Botao type="submit" disabled={pending || props.disabled} aria-busy={pending} {...props}>
      {pending ? textoEnviando : children}
    </Botao>
  );
}
