import { corAvatar } from "@/lib/comunidade";

/** Avatar em quadrado arredondado com a inicial do nome de exibição. */
export function Avatar({ id, nome, tamanho = "size-10" }: { id: string; nome: string; tamanho?: string }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-[28%] font-titulo text-sm font-semibold uppercase ${tamanho} ${corAvatar(id)}`}
    >
      {nome.trim().charAt(0) || "·"}
    </span>
  );
}
