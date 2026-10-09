import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { exigirAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ehUUID } from "@/lib/validacao";
import type { Conteudo } from "@/lib/types";
import { apagarConteudo } from "../../../actions";
import { FormConteudo } from "../FormConteudo";

export const metadata = { title: "Editar conteúdo" };

export default async function EditarConteudo({ params }: { params: Promise<{ id: string }> }) {
  await exigirAdmin();
  const { id } = await params;
  if (!ehUUID(id)) notFound();
  const { data } = await createAdminClient().from("content_items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const item = data as Conteudo;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/conteudo" className="flex w-fit items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em]">
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Conteúdos
      </Link>
      <h1 className="text-3xl font-extralight">
        Editar <span className="font-black">conteúdo</span>
      </h1>
      <FormConteudo item={item} />
      <form action={apagarConteudo.bind(null, item.id)} className="border-t border-borda pt-6">
        <button className="flex items-center gap-2 font-titulo text-xs font-semibold uppercase tracking-[0.16em] text-rose hover:underline">
          <Trash2 className="size-4" strokeWidth={1.5} />
          Apagar conteúdo
        </button>
      </form>
    </div>
  );
}
