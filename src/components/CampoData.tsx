"use client";

import { useState } from "react";

/** "AAAA-MM-DD" → "DD/MM/AAAA" */
function isoParaBR(iso: string) {
  const [a, m, d] = iso.split("-");
  return a && m && d ? `${d}/${m}/${a}` : "";
}

/** "DD/MM/AAAA" → "AAAA-MM-DD" ou "" se incompleta/inválida */
function brParaISO(br: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br);
  if (!m) return "";
  const [, d, mes, a] = m;
  const data = new Date(Date.UTC(+a, +mes - 1, +d));
  const iso = `${a}-${mes}-${d}`;
  return data.toISOString().slice(0, 10) === iso ? iso : "";
}

function mascarar(valor: string) {
  const n = valor.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

type Props = {
  id: string;
  name: string;
  rotulo: string;
  defaultValue?: string; // ISO
  max?: string; // ISO
  required?: boolean;
  ajuda?: string;
};

/**
 * Campo de data sempre em DD/MM/AAAA, independente do idioma do navegador.
 * Envia o valor em ISO (AAAA-MM-DD) por um input oculto com o `name` dado.
 */
export function CampoData({ id, name, rotulo, defaultValue = "", max, required, ajuda }: Props) {
  const [texto, setTexto] = useState(isoParaBR(defaultValue));
  const iso = brParaISO(texto);
  const completo = texto.length === 10;
  const erro = completo && (!iso ? "Data inválida." : max && iso > max ? "A data não pode estar no futuro." : "");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-grafite">
        {rotulo}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="DD/MM/AAAA"
        maxLength={10}
        required={required}
        value={texto}
        onChange={(e) => setTexto(mascarar(e.target.value))}
        aria-invalid={!!erro}
        aria-describedby={ajuda || erro ? `${id}-ajuda` : undefined}
        className="w-full rounded-xl border border-borda bg-white px-4 py-3.5 text-base tracking-wide text-grafite placeholder:text-cinza focus:border-grafite focus:outline-none aria-invalid:border-rose"
      />
      <input type="hidden" name={name} value={iso} />
      {(erro || ajuda) && (
        <p id={`${id}-ajuda`} className={`text-xs leading-relaxed ${erro ? "text-rose" : "text-cinza"}`}>
          {erro || ajuda}
        </p>
      )}
    </div>
  );
}
