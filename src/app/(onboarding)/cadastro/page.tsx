import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgressoOnboarding } from "@/components/ProgressoOnboarding";
import { FormCadastro } from "./FormCadastro";

export const metadata = { title: "Criar conta" };

export default function Cadastro() {
  return (
    <div className="flex flex-col gap-10">
      <Link href="/boas-vindas" aria-label="Voltar" className="w-fit text-grafite">
        <ArrowLeft strokeWidth={1.5} />
      </Link>
      <ProgressoOnboarding etapa={2} />
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extralight leading-tight">
          Vamos criar <span className="font-black">sua conta</span>
        </h1>
        <p className="text-[15px] leading-relaxed text-grafite/80">
          Seus dados ficam protegidos e só você tem acesso ao seu ciclo.
        </p>
      </header>
      <FormCadastro />
      <p className="text-center text-sm text-cinza">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-titulo font-semibold text-grafite underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}
