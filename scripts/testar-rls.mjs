// Testa as regras de RLS com duas usuárias temporárias (apagadas ao final).
// Uso: node --env-file=.env.local scripts/testar-rls.mjs
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let falhas = 0;
const checar = (descricao, ok) => {
  console.log(`${ok ? "✔" : "✘"} ${descricao}`);
  if (!ok) falhas++;
};

async function novaUsuaria(sufixo) {
  const email = `teste-rls-${sufixo}-${Date.now()}@exemplo.com`;
  const senha = `Senha${Date.now()}x`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
  if (error) throw error;
  const cliente = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error: e2 } = await cliente.auth.signInWithPassword({ email, password: senha });
  if (e2) throw e2;
  return { id: data.user.id, db: cliente };
}

const a = await novaUsuaria("a");
const b = await novaUsuaria("b");

try {
  // profiles
  const { data: perfilA } = await a.db.from("profiles").select("*");
  checar("perfil criado automaticamente e visível só para a dona", perfilA?.length === 1 && perfilA[0].id === a.id);
  await a.db.from("profiles").update({ nome_exibicao_comunidade: "Ana Teste", data_ultima_menstruacao: "2026-09-20" }).eq("id", a.id);
  const { data: perfisVistosPorB } = await b.db.from("profiles").select("*").eq("id", a.id);
  checar("B não lê o perfil de A", perfisVistosPorB?.length === 0);
  const { error: errFase } = await a.db.from("profiles").update({ fase_jornada: "gestante" }).eq("id", a.id);
  checar("usuária não altera fase_jornada (privilégio de coluna)", !!errFase);

  // cycle_logs
  await a.db.from("cycle_logs").insert({ user_id: a.id, data: "2026-10-01", tipo: "humor", valor: "Calma" });
  const { data: logsB } = await b.db.from("cycle_logs").select("*");
  checar("B não lê cycle_logs de A", logsB?.length === 0);
  const { error: errLogAlheio } = await b.db.from("cycle_logs").insert({ user_id: a.id, data: "2026-10-01", tipo: "humor" });
  checar("B não cria cycle_log em nome de A", !!errLogAlheio);

  // posts
  const { data: post } = await a.db.from("posts").insert({ user_id: a.id, texto: "Olá, comunidade!" }).select().single();
  checar("autor_nome preenchido pelo trigger", post?.autor_nome === "Ana Teste");
  const { data: postsB } = await b.db.from("posts").select("id").eq("id", post.id);
  checar("B lê post ativo de A", postsB?.length === 1);
  const { data: editado } = await b.db.from("posts").update({ texto: "hackeado" }).eq("id", post.id).select();
  checar("B não edita post de A", (editado?.length ?? 0) === 0);
  const { error: errAtivo } = await a.db.from("posts").update({ ativo: true }).eq("id", post.id);
  checar("autora não altera 'ativo' diretamente", !!errAtivo);

  // comments
  const { error: errCom } = await b.db.from("comments").insert({ user_id: b.id, post_id: post.id, texto: "Bem-vinda!" });
  checar("B comenta no post de A", !errCom);

  // denúncias → 3 ocultam
  const c = await novaUsuaria("c");
  const d = await novaUsuaria("d");
  for (const u of [b, c, d]) await u.db.from("post_reports").insert({ user_id: u.id, post_id: post.id, motivo: "teste" });
  const { data: postDepois } = await admin.from("posts").select("ativo, denuncias_count").eq("id", post.id).single();
  checar("3 denúncias ocultam o post", postDepois?.ativo === false && postDepois?.denuncias_count === 3);
  const { data: ocultoParaB } = await b.db.from("posts").select("id").eq("id", post.id);
  checar("post oculto some para as outras", ocultoParaB?.length === 0);
  const { data: ocultoParaA } = await a.db.from("posts").select("id").eq("id", post.id);
  checar("autora ainda vê o próprio post oculto", ocultoParaA?.length === 1);
  const { data: comOculto } = await b.db.from("comments").select("id").eq("post_id", post.id);
  checar("comentários de post oculto somem", comOculto?.length === 0);
  await admin.auth.admin.deleteUser(c.id);
  await admin.auth.admin.deleteUser(d.id);

  // content_items
  const { data: rascunho } = await admin.from("content_items").insert({ titulo: "Rascunho RLS", categoria: "ciclo", conteudo: "x", publicado: false }).select().single();
  const { data: vistos } = await a.db.from("content_items").select("id").eq("id", rascunho.id);
  checar("conteúdo não publicado é invisível", vistos?.length === 0);
  const { error: errConteudo } = await a.db.from("content_items").insert({ titulo: "x", categoria: "ciclo", conteudo: "x" });
  checar("usuária não cria conteúdo", !!errConteudo);
  await admin.from("content_items").delete().eq("id", rascunho.id);

  // consent_logs
  const { error: errConsent } = await a.db.from("consent_logs").insert({ user_id: a.id, versao_termo: "v1.0" });
  checar("registra o próprio consentimento", !errConsent);
  const { data: consB } = await b.db.from("consent_logs").select("*");
  checar("B não lê consentimentos de A", consB?.length === 0);
  const { data: apagados } = await a.db.from("consent_logs").delete().eq("user_id", a.id).select();
  checar("consentimento não pode ser apagado pela usuária", (apagados?.length ?? 0) === 0);

  // anônimo
  const anon = createClient(URL, ANON, { auth: { persistSession: false } });
  const { data: anonPosts, error: anonErr } = await anon.from("posts").select("*");
  checar("anônimo não lê nada", !!anonErr || anonPosts?.length === 0);
} finally {
  await admin.auth.admin.deleteUser(a.id);
  await admin.auth.admin.deleteUser(b.id);
  const { count } = await admin.from("cycle_logs").select("*", { count: "exact", head: true }).eq("user_id", a.id);
  checar("apagar a usuária remove os dados em cascata", count === 0);
}

console.log(falhas ? `\n${falhas} verificação(ões) falharam.` : "\nTodas as verificações passaram.");
process.exit(falhas ? 1 : 0);
