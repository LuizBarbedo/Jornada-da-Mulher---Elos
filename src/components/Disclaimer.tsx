import { Stethoscope } from "lucide-react";
import { DISCLAIMER_MEDICO } from "@/lib/marca";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[11px] leading-relaxed text-cinza ${className}`}>
      <Stethoscope aria-hidden className="mt-px size-3.5 shrink-0" strokeWidth={1.5} />
      <span>
        {DISCLAIMER_MEDICO} Em caso de dúvidas ou sintomas, procure um(a) profissional de saúde.
      </span>
    </p>
  );
}
