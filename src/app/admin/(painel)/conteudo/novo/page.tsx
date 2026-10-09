import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { exigirAdmin } from "@/lib/auth";
import { FormConteudo } from "../FormConteudo";

export const metadata = { title: "Novo conteúdo" };

export default async function NovoConteudo() {
  await exigirAdmin();
  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/conteudo" className="flex w-fit items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em]">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Conteúdos
      </Link>
      <h1 className="text-3xl font-extralight">
        Novo <span className="font-black">conteúdo</span>
      </h1>
      <FormConteudo />
    </div>
  );
}
