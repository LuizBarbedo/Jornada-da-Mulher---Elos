"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Trash2, X } from "lucide-react";
import { apagarPost, denunciarPost } from "./actions";
import { MOTIVOS_DENUNCIA } from "@/lib/comunidade";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso, Botao } from "@/components/ui";

const classeIcone =
  "grid size-8 place-items-center rounded-[28%] text-cinza transition-colors hover:bg-pastel hover:text-grafite";

export function MenuPost({ postId, minha }: { postId: string; minha: boolean }) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const denunciado = useRef(false);
  const abrir = () => dialogo.current?.showModal();
  const fechar = () => dialogo.current?.close();
  const aoFechar = () => {
    if (!denunciado.current) return;
    // Na tela do post, volta ao feed; no feed, recarrega sem o post.
    if (window.location.pathname === "/comunidade") router.refresh();
    else router.push("/comunidade");
  };

  return (
    <>
      <button onClick={abrir} aria-label={minha ? "Apagar post" : "Denunciar post"} className={classeIcone}>
        {minha ? <Trash2 className="size-4" strokeWidth={1.5} /> : <Flag className="size-4" strokeWidth={1.5} />}
      </button>
      <dialog
        ref={dialogo}
        onClose={aoFechar}
        onClick={(e) => {
          if (e.target === dialogo.current) fechar();
        }}
        className="mx-auto mb-0 mt-auto w-full max-w-md rounded-t-3xl bg-white p-0 text-grafite backdrop:bg-grafite/40"
      >
        <div className="flex flex-col gap-6 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-light">{minha ? "Apagar este post?" : "Denunciar post"}</h2>
            <button onClick={fechar} aria-label="Fechar" className={classeIcone}>
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          {minha ? (
            <ConfirmarApagar postId={postId} onCancelar={fechar} />
          ) : (
            <FormDenuncia
              postId={postId}
              onDenunciado={() => (denunciado.current = true)}
              onFechar={fechar}
            />
          )}
        </div>
      </dialog>
    </>
  );
}

function ConfirmarApagar({ postId, onCancelar }: { postId: string; onCancelar: () => void }) {
  return (
    <form action={apagarPost.bind(null, postId)} className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-grafite/80">
        O post e todos os comentários dele serão apagados de forma permanente.
      </p>
      <BotaoEnviar variante="perigo" textoEnviando="Apagando…">
        Apagar post
      </BotaoEnviar>
      <Botao type="button" variante="fantasma" onClick={onCancelar}>
        Cancelar
      </Botao>
    </form>
  );
}

type PropsDenuncia = { postId: string; onDenunciado: () => void; onFechar: () => void };

function FormDenuncia({ postId, onDenunciado, onFechar }: PropsDenuncia) {
  const [estado, acao] = useActionState(denunciarPost, undefined);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (estado?.sucesso) onDenunciado();
  }, [estado, onDenunciado]);

  if (estado?.sucesso) {
    return (
      <div className="flex flex-col gap-4">
        <Aviso tipo="sucesso">{estado.sucesso}</Aviso>
        <Botao type="button" onClick={onFechar}>
          Fechar
        </Botao>
      </div>
    );
  }

  return (
    <form action={acao} className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-grafite/80">
        Sua denúncia é anônima. O post deixa de aparecer para você e nossa equipe vai revisá-lo.
      </p>
      <input type="hidden" name="post_id" value={postId} />
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Motivo</legend>
        {MOTIVOS_DENUNCIA.map((m) => (
          <label
            key={m}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-borda px-4 py-3 text-sm has-checked:border-grafite has-checked:bg-pastel"
          >
            <input
              type="radio"
              name="motivo"
              value={m}
              checked={motivo === m}
              onChange={() => setMotivo(m)}
              className="accent-grafite"
            />
            {m}
          </label>
        ))}
      </fieldset>
      {estado?.erro && <Aviso>{estado.erro}</Aviso>}
      <BotaoEnviar disabled={!motivo} textoEnviando="Enviando…">
        Enviar denúncia
      </BotaoEnviar>
    </form>
  );
}
