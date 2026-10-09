"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { etapaPendente, exigirUsuaria } from "@/lib/auth";
import { VERSAO_TERMO } from "@/lib/consentimento";
import type { EstadoForm } from "@/lib/types";
import {
  texto,
  validarDUM,
  validarDuracaoCiclo,
  validarEmail,
  validarNomeExibicao,
  validarSenha,
  sanitizarTexto,
} from "@/lib/validacao";

function traduzirErroAuth(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("already registered")) return "Este e-mail já tem cadastro. Que tal entrar?";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas seguidas. Aguarde alguns minutos.";
  if (m.includes("password")) return "Essa senha não foi aceita. Tente uma senha mais forte.";
  return "Não foi possível concluir agora. Tente novamente em instantes.";
}

export async function cadastrar(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const email = texto(form, "email").toLowerCase();
  const senha = String(form.get("senha") ?? "");
  const erro = validarEmail(email) ?? validarSenha(senha);
  if (erro) return { erro };

  const supabase = await createClient();
  const origem = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { emailRedirectTo: `${origem}/auth/confirmar` },
  });
  if (error) return { erro: traduzirErroAuth(error.message) };

  if (!data.session) {
    return {
      sucesso: "Quase lá! Enviamos um link de confirmação para o seu e-mail. Abra-o para continuar sua jornada.",
    };
  }
  redirect("/consentimento");
}

export async function entrar(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const email = texto(form, "email").toLowerCase();
  const senha = String(form.get("senha") ?? "");
  if (validarEmail(email) || !senha) return { erro: "Informe e-mail e senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { erro: traduzirErroAuth(error.message) };
  redirect("/inicio");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/boas-vindas");
}

export async function registrarConsentimento(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  if (form.get("aceito") !== "on") {
    return { erro: "Para continuar, é preciso ler e aceitar os termos." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("consent_logs")
    .insert({ user_id: user.id, versao_termo: VERSAO_TERMO });
  if (error) {
    console.error("consentimento: falha ao registrar", error.code);
    return { erro: "Não conseguimos registrar seu aceite. Tente novamente." };
  }
  redirect((await etapaPendente()) ?? "/inicio");
}

export async function salvarPerfilInicial(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  const dum = texto(form, "data_ultima_menstruacao");
  const erroDUM = validarDUM(dum);
  if (erroDUM) return { erro: erroDUM };
  const ciclo = validarDuracaoCiclo(texto(form, "duracao_ciclo_dias"));
  if (ciclo.erro) return { erro: ciclo.erro };
  const exibicao = validarNomeExibicao(texto(form, "nome_exibicao_comunidade"));
  if (exibicao.erro) return { erro: exibicao.erro };
  const nome = sanitizarTexto(texto(form, "nome"), 80) || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      nome,
      data_ultima_menstruacao: dum,
      duracao_ciclo_dias: ciclo.valor,
      nome_exibicao_comunidade: exibicao.valor,
    })
    .eq("id", user.id);
  if (error) {
    console.error("perfil inicial: falha ao salvar", error.code);
    return { erro: "Não conseguimos salvar agora. Tente novamente." };
  }
  redirect("/inicio");
}
