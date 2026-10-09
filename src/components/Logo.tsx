/** Wordmark provisório no estilo "elos": minúsculo, grafite, com o quadradinho verde. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.18em] font-titulo text-2xl font-light lowercase tracking-tight text-grafite ${className}`}
      aria-label="[nome]"
    >
      [nome]
      <span aria-hidden className="inline-block size-[0.55em] translate-y-[0.08em] rounded-[28%] bg-verde" />
    </span>
  );
}
