"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { criarPost } from "./actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso } from "@/components/ui";

const MAX = 1000;

export function NovoPost() {
  const [estado, acao] = useActionState(criarPost, undefined);
  const [texto, setTexto] = useState("");
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado?.sucesso) setTexto("");
  }, [estado]);

  return (
    <form ref={form} action={acao} className="flex flex-col gap-3 rounded-2xl bg-pastel p-5">
      <label htmlFor="novo-post" className="font-titulo text-sm font-semibold">
        O que você quer compartilhar hoje?
      </label>
      <textarea
        id="novo-post"
        name="texto"
        rows={3}
        maxLength={MAX}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Uma dúvida, uma conquista, um desabafo…"
        className="w-full resize-none rounded-xl border border-borda bg-white px-4 py-3 text-base leading-relaxed placeholder:text-cinza focus:border-grafite focus:outline-none"
      />
      {estado?.erro && <Aviso>{estado.erro}</Aviso>}
      {estado?.sucesso && !texto && <Aviso tipo="sucesso">{estado.sucesso}</Aviso>}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] text-cinza">
          {texto.length}/{MAX}
        </span>
        <BotaoEnviar disabled={texto.trim().length < 2} textoEnviando="Publicando…" className="px-5 py-3">
          Publicar
        </BotaoEnviar>
      </div>
    </form>
  );
}
