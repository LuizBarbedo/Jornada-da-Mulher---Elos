import { WifiOff } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Sem conexão" };

export default function Offline() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-10 px-6 py-10">
      <Logo />
      <span className="grid size-16 place-items-center rounded-[28%] bg-pastel">
        <WifiOff className="size-7" strokeWidth={1.5} />
      </span>
      <h1 className="text-4xl font-extralight leading-tight">
        Você está <span className="font-black">sem conexão</span>
      </h1>
      <p className="text-[15px] leading-relaxed text-grafite/80">
        Assim que a internet voltar, é só tentar de novo. Seus dados ficam guardados com segurança.
      </p>
    </main>
  );
}
