const ETAPAS = ["Boas-vindas", "Cadastro", "Consentimento", "Seu ciclo"];

export function ProgressoOnboarding({ etapa }: { etapa: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={ETAPAS.length}
        aria-valuenow={etapa}
        aria-label={`Etapa ${etapa} de ${ETAPAS.length}: ${ETAPAS[etapa - 1]}`}
      >
        {ETAPAS.map((nome, i) => (
          <span key={nome} className={`h-1 flex-1 rounded-full ${i < etapa ? "bg-verde" : "bg-borda"}`} />
        ))}
      </div>
      <p className="font-titulo text-[11px] font-semibold uppercase tracking-[0.22em] text-cinza">
        {etapa} de {ETAPAS.length} · {ETAPAS[etapa - 1]}
      </p>
    </div>
  );
}
