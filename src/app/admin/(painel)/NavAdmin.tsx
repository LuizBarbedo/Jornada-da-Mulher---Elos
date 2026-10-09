"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  { href: "/admin", rotulo: "Moderação" },
  { href: "/admin/conteudo", rotulo: "Conteúdos" },
];

export function NavAdmin() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 border-b border-borda">
      {ABAS.map(({ href, rotulo }) => {
        const ativo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={ativo ? "page" : undefined}
            className={`-mb-px border-b-2 py-4 font-titulo text-xs font-semibold uppercase tracking-[0.18em] ${
              ativo ? "border-verde text-grafite" : "border-transparent text-cinza hover:text-grafite"
            }`}
          >
            {rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
