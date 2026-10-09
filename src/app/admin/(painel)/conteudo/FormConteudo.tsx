"use client";

import { useActionState } from "react";
import { salvarConteudo } from "../../actions";
import { BotaoEnviar } from "@/components/BotaoEnviar";
import { AreaTexto, Aviso, Campo } from "@/components/ui";
import { CATEGORIAS, LISTA_CATEGORIAS } from "@/lib/conteudo";
import type { Conteudo } from "@/lib/types";

const rotulo = "text-[11px] font-semibold uppercase tracking-[0.16em]";

export function FormConteudo({ item }: { item?: Conteudo }) {
  const [estado, acao] = useActionState(salvarConteudo.bind(null, item?.id ?? null), undefined);

  return (
    <form action={acao} className="flex flex-col gap-7">
      <Campo id="titulo" name="titulo" rotulo="Título" required maxLength={140} defaultValue={item?.titulo} />

      <div className="flex flex-col gap-2">
        <label htmlFor="categoria" className={rotulo}>
          Categoria
        </label>
        <select
          id="categoria"
          name="categoria"
          required
          defaultValue={item?.categoria ?? ""}
          className="w-full rounded-xl border border-borda bg-white px-4 py-3.5 text-base focus:border-grafite focus:outline-none"
        >
          <option value="" disabled>
            Escolha…
          </option>
          {LISTA_CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {CATEGORIAS[c].nome}
            </option>
          ))}
        </select>
      </div>

      <AreaTexto id="resumo" name="resumo" rotulo="Resumo (até 300 caracteres)" rows={3} maxLength={300} defaultValue={item?.resumo ?? ""} />

      <div className="flex flex-col gap-2">
        <AreaTexto
          id="conteudo"
          name="conteudo"
          rotulo="Texto"
          rows={16}
          required
          defaultValue={item?.conteudo}
          className="font-mono text-sm"
        />
        <p className="text-xs leading-relaxed text-cinza">
          Formato: parágrafos separados por linha em branco · <code>## Subtítulo</code> · linhas começando com{" "}
          <code>- </code> viram lista · <code>**negrito**</code>
        </p>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-2xl border border-borda p-5">
        <legend className={`${rotulo} px-2`}>Imagem de capa (opcional)</legend>
        {item?.url_imagem && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url_imagem} alt="Capa atual" className="aspect-[4/3] w-48 rounded-xl object-cover" />
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="imagem" className="text-sm">
            Enviar arquivo (JPG, PNG ou WEBP, até 5 MB)
          </label>
          <input id="imagem" name="imagem" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
        </div>
        <Campo
          id="url_imagem"
          name="url_imagem"
          rotulo="…ou URL da imagem"
          type="url"
          placeholder="https://"
          defaultValue={item?.url_imagem ?? ""}
          ajuda="Se enviar um arquivo, ele substitui a URL. Deixe em branco para usar a capa geométrica."
        />
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-borda p-4 has-checked:border-grafite has-checked:bg-pastel">
        <input type="checkbox" name="publicado" defaultChecked={item?.publicado ?? false} className="size-5 accent-grafite" />
        <span className="font-titulo text-sm font-semibold">Publicado (visível no app)</span>
      </label>

      <Aviso>{estado?.erro}</Aviso>
      <BotaoEnviar textoEnviando="Salvando…">Salvar conteúdo</BotaoEnviar>
    </form>
  );
}
