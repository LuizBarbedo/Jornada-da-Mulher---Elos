import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hojeISO } from "@/lib/datas";

/**
 * Exportação LGPD (art. 18, II e V): todos os dados da usuária em JSON.
 * Usa o cliente com a sessão dela, então o RLS garante que só os próprios
 * dados entram no arquivo.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ erro: "Não autenticada" }, { status: 401 });

  const [perfil, registros, posts, comentarios, denuncias, consentimentos] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cycle_logs").select("*").eq("user_id", user.id).order("data"),
    supabase.from("posts").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("comments").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("post_reports").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("consent_logs").select("*").eq("user_id", user.id).order("aceito_em"),
  ]);

  const exportacao = {
    gerado_em: new Date().toISOString(),
    aviso: "Exportação completa dos seus dados pessoais, conforme a LGPD.",
    conta: { id: user.id, email: user.email, criada_em: user.created_at },
    perfil: perfil.data,
    registros_do_ciclo: registros.data ?? [],
    posts: posts.data ?? [],
    comentarios: comentarios.data ?? [],
    denuncias_feitas: denuncias.data ?? [],
    consentimentos: consentimentos.data ?? [],
  };

  return new NextResponse(JSON.stringify(exportacao, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="meus-dados-${hojeISO()}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
