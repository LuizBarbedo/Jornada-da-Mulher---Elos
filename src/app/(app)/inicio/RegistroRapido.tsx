"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Droplet, NotebookPen, Smile, Sparkles, X } from "lucide-react";
import { registrarHoje } from "./actions";
import { OPCOES } from "@/lib/registros";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { Aviso } from "@/components/ui";
import type { TipoRegistro } from "@/lib/types";

const BOTOES: { tipo: TipoRegistro; icone: typeof Droplet; cor: string }[] = [
  { tipo: "menstruacao", icone: Droplet, cor: "bg-rose text-white" },
  { tipo: "humor", icone: Smile, cor: "bg-rose/10 text-rose" },
  { tipo: "sintoma", icone: Sparkles, cor: "bg-pastel text-grafite" },
  { tipo: "observacao", icone: NotebookPen, cor: "bg-pastel text-grafite" },
];

export function RegistroRapido() {
  const [tipo, setTipo] = useState<TipoRegistro | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  const abrir = (t: TipoRegistro) => {
    setTipo(t);
    dialogo.current?.showModal();
  };
  const fechar = () => dialogo.current?.close();

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {BOTOES.map(({ tipo: t, icone: Icone, cor }) => (
          <button key={t} onClick={() => abrir(t)} className="flex flex-col items-center gap-2">
            <span className={`grid size-15 place-items-center rounded-[28%] ${cor}`}>
              <Icone className="size-6" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">{OPCOES[t].titulo}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogo}
        onClose={() => setTipo(null)}
        onClick={(e) => {
          if (e.target === dialogo.current) fechar();
        }}
        className="mx-auto mb-0 mt-auto w-full max-w-md rounded-t-3xl bg-white p-0 text-grafite backdrop:bg-grafite/40"
      >
        {tipo && <FormRegistro key={tipo} tipo={tipo} onFechar={fechar} />}
      </dialog>
    </>
  );
}

function FormRegistro({ tipo, onFechar }: { tipo: TipoRegistro; onFechar: () => void }) {
  const [estado, acao] = useActionState(registrarHoje, undefined);
  const [valor, setValor] = useState("");
  const config = OPCOES[tipo];
  const acolhimento = tipo === "humor";

  useEffect(() => {
    if (estado?.sucesso) {
      const t = setTimeout(onFechar, 900);
      return () => clearTimeout(t);
    }
  }, [estado, onFechar]);

  return (
    <form action={acao} className="flex flex-col gap-6 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p
            className={`font-titulo text-[11px] font-semibold uppercase tracking-[0.22em] ${
              acolhimento ? "text-rose" : "text-cinza"
            }`}
          >
            Hoje · {config.titulo}
          </p>
          <h2 className="text-2xl font-light leading-snug">{config.pergunta}</h2>
        </div>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="grid size-9 shrink-0 place-items-center rounded-[28%] hover:bg-pastel"
        >
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="valor" value={valor} />

      {config.opcoes.length > 0 && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={config.pergunta}>
          {config.opcoes.map((op) => {
            const sel = valor === op;
            const corSel = acolhimento ? "border-rose bg-rose text-white" : "border-grafite bg-grafite text-white";
            return (
              <button
                key={op}
                type="button"
                role="radio"
                aria-checked={sel}
                onClick={() => setValor(sel ? "" : op)}
                className={`rounded-xl border px-4 py-2.5 font-corpo text-sm transition-colors ${
                  sel ? corSel : "border-borda bg-white hover:border-grafite"
                }`}
              >
                {op}
              </button>
            );
          })}
        </div>
      )}

      <textarea
        name="texto_livre"
        rows={3}
        maxLength={500}
        placeholder={tipo === "observacao" ? "Escreva aqui…" : "Quer acrescentar algo? (opcional)"}
        aria-label="Nota"
        className="w-full resize-none rounded-xl border border-borda px-4 py-3 text-base leading-relaxed placeholder:text-cinza focus:border-grafite focus:outline-none"
      />

      {estado?.erro && <Aviso>{estado.erro}</Aviso>}
      {estado?.sucesso && <Aviso tipo="sucesso">{estado.sucesso}</Aviso>}
      <BotaoEnviar textoEnviando="Salvando…">Salvar registro</BotaoEnviar>
    </form>
  );
}
