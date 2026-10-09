import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FormEntrar } from "./FormEntrar";

export const metadata = { title: "Entrar" };

export default function Entrar() {
  return (
    <div className="flex flex-col gap-12">
      <Logo />
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extralight leading-tight">
          Que bom te ver <span className="font-black">de novo</span>
        </h1>
        <p className="text-[15px] leading-relaxed text-grafite/80">Entre para continuar acompanhando sua jornada.</p>
      </header>
      <FormEntrar />
      <p className="text-center text-sm text-cinza">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-titulo font-semibold text-grafite underline underline-offset-4">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
