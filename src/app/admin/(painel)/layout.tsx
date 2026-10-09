import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { exigirAdmin } from "@/lib/auth";
import { sairAdmin } from "../actions";
import { NavAdmin } from "./NavAdmin";

export const metadata = { title: { default: "Admin", template: "%s · Admin" } };

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await exigirAdmin();
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-borda pb-6">
        <Link href="/admin" className="flex items-baseline gap-3">
          <Logo />
          <span className="font-titulo text-[11px] font-semibold uppercase tracking-[0.22em] text-cinza">admin</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-cinza">
          <span className="hidden sm:inline">{user.email}</span>
          <form action={sairAdmin}>
            <button aria-label="Sair" className="grid size-9 place-items-center rounded-[28%] hover:bg-pastel hover:text-grafite">
              <LogOut className="size-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </header>
      <NavAdmin />
      <main className="pt-8">{children}</main>
    </div>
  );
}
