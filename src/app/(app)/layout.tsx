import { redirect } from "next/navigation";
import { NavInferior } from "@/components/NavInferior";
import { etapaPendente, exigirUsuaria } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await exigirUsuaria();
  const pendente = await etapaPendente();
  if (pendente) redirect(pendente);

  return (
    <>
      <main className="mx-auto w-full max-w-md px-6 pb-32 pt-8">{children}</main>
      <NavInferior />
    </>
  );
}
