import { Logo } from "@/components/Logo";
import { Sobretitulo } from "@/components/ui";
import { FormEntrar } from "@/app/(onboarding)/entrar/FormEntrar";
import { entrarAdmin } from "../actions";

export const metadata = { title: "Admin" };

export default function LoginAdmin() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-10 px-6 py-10">
      <Logo />
      <header className="flex flex-col gap-2">
        <Sobretitulo>Painel administrativo</Sobretitulo>
        <h1 className="text-4xl font-extralight">
          Acesso <span className="font-black">restrito</span>
        </h1>
      </header>
      <FormEntrar acao={entrarAdmin} />
    </main>
  );
}
