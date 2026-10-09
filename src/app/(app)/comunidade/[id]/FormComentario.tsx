"use client";

import { useActionState, useEffect, useState } from "react";
import { comentar } from "../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso } from "@/components/ui";

export function FormComentario({ postId }: { postId: string }) {
  const [estado, acao] = useActionState(comentar, undefined);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (estado?.sucesso) setTexto("");
  }, [estado]);

  return (
    <form action={acao} className="flex flex-col gap-3">
      <input type="hidden" name="post_id" value={postId} />
      <label htmlFor="comentario" className="sr-only">
        Seu comentário
      </label>
      <textarea
        id="comentario"
        name="texto"
        rows={2}
        maxLength={500}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva uma palavra de apoio…"
        className="w-full resize-none rounded-xl border border-borda px-4 py-3 text-base leading-relaxed placeholder:text-cinza focus:border-grafite focus:outline-none"
      />
      {estado?.erro && <Aviso>{estado.erro}</Aviso>}
      <BotaoEnviar disabled={texto.trim().length < 2} textoEnviando="Enviando…" className="self-end px-5 py-3">
        Comentar
      </BotaoEnviar>
    </form>
  );
}
