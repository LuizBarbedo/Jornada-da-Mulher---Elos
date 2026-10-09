"use client";

import { useActionState, useState } from "react";
import { registrarConsentimento } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso } from "@/components/ui";

export function FormConsentimento() {
  const [estado, acao] = useActionState(registrarConsentimento, undefined);
  const [aceito, setAceito] = useState(false);

  return (
    <form action={acao} className="flex flex-col gap-6">
      <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-borda p-5 has-checked:border-grafite has-checked:bg-pastel">
        <input
          type="checkbox"
          name="aceito"
          required
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-grafite"
        />
        <span className="font-corpo text-sm leading-relaxed">
          Li e aceito os{" "}
          <a href="/termos" target="_blank" className="font-titulo font-semibold underline underline-offset-4">
            Termos de Uso e a Política de Privacidade
          </a>{" "}
          e autorizo o tratamento dos meus dados de saúde para as finalidades descritas.
        </span>
      </label>
      <Aviso>{estado?.erro}</Aviso>
      <BotaoEnviar disabled={!aceito} textoEnviando="Registrando…">
        Aceitar e continuar
      </BotaoEnviar>
    </form>
  );
}
