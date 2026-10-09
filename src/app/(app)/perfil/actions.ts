"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { exigirUsuaria } from "@/lib/auth";
import type { EstadoForm } from "@/lib/types";
import {
  sanitizarTexto,
  texto,
  validarDUM,
  validarDuracaoCiclo,
  validarNascimento,
  validarNomeExibicao,
} from "@/lib/validacao";

export async function atualizarPerfil(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();

  const dum = texto(form, "data_ultima_menstruacao");
  const erroDUM = validarDUM(dum);
  if (erroDUM) return { erro: erroDUM };
  const ciclo = validarDuracaoCiclo(texto(form, "duracao_ciclo_dias"));
  if (ciclo.erro) return { erro: ciclo.erro };
  const exibicao = validarNomeExibicao(texto(form, "nome_exibicao_comunidade"));
  if (exibicao.erro) return { erro: exibicao.erro };
  const nascimento = validarNascimento(texto(form, "data_nascimento"));
  if (nascimento.erro) return { erro: nascimento.erro };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      nome: sanitizarTexto(texto(form, "nome"), 80) || null,
      data_nascimento: nascimento.valor,
      data_ultima_menstruacao: dum,
      duracao_ciclo_dias: ciclo.valor,
      nome_exibicao_comunidade: exibicao.valor,
    })
    .eq("id", user.id);
  if (error) {
    console.error("perfil: falha ao atualizar", error.code);
    return { erro: "Não conseguimos salvar agora. Tente novamente." };
  }
  revalidatePath("/", "layout");
  return { sucesso: "Perfil atualizado." };
}

const FRASE_CONFIRMACAO = "APAGAR"; // mesma frase exibida em ApagarConta.tsx

/**
 * Exclusão definitiva (LGPD, art. 18, VI). Remover o usuário de auth.users
 * apaga em cascata perfil, registros, posts, comentários, denúncias e
 * consentimentos (FKs com ON DELETE CASCADE).
 */
export async function apagarConta(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  if (texto(form, "confirmacao").toUpperCase() !== FRASE_CONFIRMACAO) {
    return { erro: `Digite ${FRASE_CONFIRMACAO} para confirmar.` };
  }

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("perfil: falha ao apagar conta", error.status);
    return { erro: "Não conseguimos apagar sua conta agora. Tente novamente em instantes." };
  }

  const supabase = await createClient();
  // A conta já não existe no servidor: só limpa os cookies locais.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/conta-apagada");
}
