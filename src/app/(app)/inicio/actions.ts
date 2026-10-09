"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { exigirUsuaria, getPerfil } from "@/lib/auth";
import { diferencaDias, hojeISO } from "@/lib/datas";
import { DIAS_MENSTRUACAO } from "@/lib/ciclo";
import { OPCOES, TIPOS } from "@/lib/registros";
import { ehUUID, sanitizarTexto, texto } from "@/lib/validacao";
import type { EstadoForm, TipoRegistro } from "@/lib/types";

export async function registrarHoje(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  const user = await exigirUsuaria();
  const tipo = texto(form, "tipo") as TipoRegistro;
  if (!TIPOS.includes(tipo)) return { erro: "Tipo de registro inválido." };

  const valor = texto(form, "valor") || null;
  if (valor && !OPCOES[tipo].opcoes.includes(valor)) return { erro: "Opção inválida." };
  const nota = sanitizarTexto(form.get("texto_livre"), 500) || null;
  if (!valor && !nota) {
    return { erro: tipo === "observacao" ? "Escreva sua observação." : "Escolha uma opção ou escreva uma nota." };
  }

  const hoje = hojeISO();
  const supabase = await createClient();
  const { error } = await supabase
    .from("cycle_logs")
    .insert({ user_id: user.id, data: hoje, tipo, valor, texto_livre: nota });
  if (error) {
    console.error("registro: falha ao salvar", error.code);
    return { erro: "Não conseguimos salvar agora. Tente novamente." };
  }

  // Menstruação registrada longe da última DUM = início de um novo ciclo.
  if (tipo === "menstruacao") {
    const perfil = await getPerfil();
    const dum = perfil?.data_ultima_menstruacao;
    if (!dum || diferencaDias(dum, hoje) > DIAS_MENSTRUACAO + 5) {
      await supabase.from("profiles").update({ data_ultima_menstruacao: hoje }).eq("id", user.id);
    }
  }

  revalidatePath("/inicio");
  return { sucesso: "Registrado com carinho." };
}

export async function apagarRegistro(id: string) {
  if (!ehUUID(id)) return;
  await exigirUsuaria();
  const supabase = await createClient();
  // RLS garante que só os próprios registros podem ser apagados.
  await supabase.from("cycle_logs").delete().eq("id", id);
  revalidatePath("/inicio");
}
