"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarHeart, User, Users } from "lucide-react";

const ITENS = [
  { href: "/inicio", rotulo: "Início", icone: CalendarHeart },
  { href: "/comunidade", rotulo: "Comunidade", icone: Users },
  { href: "/conteudo", rotulo: "Conteúdo", icone: BookOpen },
  { href: "/perfil", rotulo: "Perfil", icone: User },
];

export function NavInferior() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-borda bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md">
        {ITENS.map(({ href, rotulo, icone: Icone }) => {
          const ativo = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
              >
                <span className={`grid size-9 place-items-center rounded-[28%] transition-colors ${ativo ? "bg-verde" : ""}`}>
                  <Icone className="size-5" strokeWidth={1.5} />
                </span>
                <span className={ativo ? "text-grafite" : "text-cinza"}>{rotulo}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
