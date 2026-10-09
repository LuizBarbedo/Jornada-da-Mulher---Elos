import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VERSAO_TERMO } from "@/lib/consentimento";
import type { Perfil } from "@/lib/types";

/** Usuária da requisição atual (validada no servidor do Supabase). */
export const getUsuaria = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function exigirUsuaria() {
  const user = await getUsuaria();
  if (!user) redirect("/entrar");
  return user;
}

export const getPerfil = cache(async (): Promise<Perfil | null> => {
  const user = await getUsuaria();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data as Perfil | null;
});

export const aceitouTermoVigente = cache(async (): Promise<boolean> => {
  const user = await getUsuaria();
  if (!user) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("consent_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("versao_termo", VERSAO_TERMO)
    .limit(1);
  return (data?.length ?? 0) > 0;
});

/** Próxima etapa do onboarding que ainda falta, ou null se completo. */
export async function etapaPendente(): Promise<"/consentimento" | "/perfil-inicial" | null> {
  if (!(await aceitouTermoVigente())) return "/consentimento";
  const perfil = await getPerfil();
  if (!perfil?.data_ultima_menstruacao || !perfil.nome_exibicao_comunidade) return "/perfil-inicial";
  return null;
}

export function ehAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const lista = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(email.toLowerCase());
}
