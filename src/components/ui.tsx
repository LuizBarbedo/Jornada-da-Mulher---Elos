import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma" | "perigo";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-titulo text-xs font-semibold uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primario: "bg-verde text-grafite hover:bg-verde/85",
  secundario: "border border-grafite text-grafite hover:bg-grafite hover:text-white",
  fantasma: "text-grafite underline-offset-4 hover:underline",
  perigo: "border border-rose text-rose hover:bg-rose hover:text-white",
};

export function classeBotao(variante: Variante = "primario", extra = "") {
  return `${base} ${variantes[variante]} ${extra}`;
}

export function Botao({
  variante = "primario",
  className = "",
  ...props
}: ComponentProps<"button"> & { variante?: Variante }) {
  return <button className={classeBotao(variante, className)} {...props} />;
}

export function LinkBotao({
  variante = "primario",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={classeBotao(variante, className)} {...props} />;
}

export function Campo({
  rotulo,
  ajuda,
  id,
  className = "",
  ...props
}: ComponentProps<"input"> & { rotulo: string; ajuda?: string; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-grafite">
        {rotulo}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-borda bg-white px-4 py-3.5 text-base text-grafite placeholder:text-cinza focus:border-grafite focus:outline-none ${className}`}
        {...props}
      />
      {ajuda && <p className="text-xs leading-relaxed text-cinza">{ajuda}</p>}
    </div>
  );
}

export function AreaTexto({
  rotulo,
  id,
  className = "",
  ...props
}: ComponentProps<"textarea"> & { rotulo: string; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-grafite">
        {rotulo}
      </label>
      <textarea
        id={id}
        className={`w-full resize-none rounded-xl border border-borda bg-white px-4 py-3.5 text-base leading-relaxed text-grafite placeholder:text-cinza focus:border-grafite focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}

export function Aviso({ tipo = "erro", children }: { tipo?: "erro" | "sucesso"; children: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role={tipo === "erro" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
        tipo === "erro" ? "bg-rose/10 text-rose" : "bg-pastel text-grafite"
      }`}
    >
      {children}
    </p>
  );
}

/** Rótulo editorial pequeno, em caixa alta, acima de títulos. */
export function Sobretitulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-titulo text-[11px] font-semibold uppercase tracking-[0.22em] text-cinza ${className}`}>
      {children}
    </p>
  );
}

/** Quadrado arredondado — motivo geométrico da marca. */
export function Quadrado({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block rounded-[28%] ${className}`} />;
}
