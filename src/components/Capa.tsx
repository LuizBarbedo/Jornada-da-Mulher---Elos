import { CATEGORIAS } from "@/lib/conteudo";
import type { Categoria } from "@/lib/types";

/**
 * Capa do conteúdo: a foto, se houver; senão uma composição geométrica
 * com o quadrado arredondado na cor da categoria.
 */
export function Capa({
  url,
  categoria,
  className = "",
}: {
  url: string | null;
  categoria: Categoria;
  className?: string;
}) {
  if (url) {
    // <img> simples: as URLs podem vir de qualquer host https informado no admin.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" loading="lazy" className={`object-cover ${className}`} />;
  }
  const { cor } = CATEGORIAS[categoria];
  return (
    <div aria-hidden className={`relative overflow-hidden ${cor} ${className}`}>
      <span className="absolute -bottom-[18%] -right-[8%] aspect-square w-[55%] rounded-[28%] bg-white/25" />
      <span className="absolute right-[38%] top-[18%] aspect-square w-[14%] rounded-[28%] bg-white/35" />
      <span className="absolute left-[10%] top-[12%] aspect-square w-[8%] rounded-[28%] bg-white/30" />
    </div>
  );
}
