"use client";

import { useActionState, useRef, useState } from "react";
import { X } from "lucide-react";
import { apagarConta } from "./actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso, Botao } from "@/components/ui";

const FRASE = "APAGAR";

export function ApagarConta() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [estado, acao] = useActionState(apagarConta, undefined);
  const [confirmacao, setConfirmacao] = useState("");

  return (
    <>
      <Botao variante="perigo" onClick={() => dialogo.current?.showModal()}>
        Apagar minha conta
      </Botao>

      <dialog
        ref={dialogo}
        onClick={(e) => {
          if (e.target === dialogo.current) dialogo.current?.close();
        }}
        className="mx-auto mb-0 mt-auto w-full max-w-md rounded-t-3xl bg-white p-0 text-grafite backdrop:bg-grafite/40"
      >
        <form action={acao} className="flex flex-col gap-6 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-light">
              Apagar sua conta <span className="font-black">de vez?</span>
            </h2>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              aria-label="Fechar"
              className="grid size-9 shrink-0 place-items-center rounded-[28%] hover:bg-pastel"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-grafite/80">
            <p>Vamos apagar permanentemente, sem possibilidade de recuperação:</p>
            <ul className="list-inside list-disc text-grafite">
              <li>seu perfil e seus registros do ciclo;</li>
              <li>seus posts, comentários e denúncias;</li>
              <li>seus registros de consentimento e sua conta de acesso.</li>
            </ul>
            <p>Se quiser guardar uma cópia, exporte seus dados antes.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmacao" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              Digite {FRASE} para confirmar
            </label>
            <input
              id="confirmacao"
              name="confirmacao"
              autoComplete="off"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              className="w-full rounded-xl border border-borda px-4 py-3.5 text-base uppercase tracking-widest focus:border-rose focus:outline-none"
            />
          </div>
          <Aviso>{estado?.erro}</Aviso>
          <BotaoEnviar variante="perigo" disabled={confirmacao.trim().toUpperCase() !== FRASE} textoEnviando="Apagando…">
            Apagar tudo definitivamente
          </BotaoEnviar>
        </form>
      </dialog>
    </>
  );
}
