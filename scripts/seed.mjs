// Seed: 6 conteúdos publicados + 3 posts da conta oficial da equipe.
// Uso: node --env-file=.env.local scripts/seed.mjs
// Idempotente: não duplica conteúdos (pelo título) nem a conta da equipe.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const EMAIL_EQUIPE = "equipe+seed@exemplo.com";
const NOME_EQUIPE = "Equipe [nome]";

const CONTEUDOS = [
  {
    titulo: "Ácido fólico: por que ele importa antes de engravidar",
    categoria: "nutricao",
    resumo: "Um nutriente pequeno com um papel enorme na formação do bebê. Entenda quando começar e onde encontrá-lo.",
    conteudo: `O ácido fólico (a forma sintética do folato, uma vitamina do complexo B) participa da formação do tubo neural do bebê, estrutura que dá origem ao cérebro e à medula espinhal. Essa formação acontece nas primeiras semanas de gestação, muitas vezes antes mesmo de a mulher saber que está grávida.

Por isso, a orientação geral de saúde é que mulheres que estão tentando engravidar conversem com seu médico ou sua médica sobre a suplementação **antes** da concepção.

## Onde encontrar folato na alimentação

- Folhas verde-escuras, como espinafre, couve e rúcula
- Leguminosas: feijão, lentilha e grão-de-bico
- Abacate, laranja e brócolis
- Cereais e farinhas enriquecidos

## Alimentação e suplemento caminham juntos

Uma alimentação variada é a base, mas nem sempre é suficiente para alcançar a quantidade recomendada nessa fase. A dose e o momento de começar a suplementação devem ser definidos com um(a) profissional de saúde, que considera seu histórico e suas necessidades.

Cuidar da nutrição agora é um gesto de carinho com você e com o futuro que você está planejando.`,
  },
  {
    titulo: "Prato colorido: um guia simples para a fase tentante",
    categoria: "nutricao",
    resumo: "Sem dietas restritivas: pequenas escolhas diárias que ajudam seu corpo a se preparar.",
    conteudo: `Não existe um alimento milagroso para engravidar, mas existe um padrão alimentar que favorece a saúde como um todo, inclusive a reprodutiva. A ideia é simples: variedade, cor e comida de verdade.

## Monte seu prato

- **Metade do prato** com vegetais e legumes de cores diferentes
- **Um quarto** com proteínas: ovos, peixes, frango, feijões
- **Um quarto** com carboidratos integrais: arroz integral, batata-doce, mandioca
- Uma porção de gordura boa: azeite, castanhas ou abacate

## Pequenos ajustes que fazem diferença

- Beba água ao longo do dia
- Reduza ultraprocessados, bebidas açucaradas e excesso de cafeína
- Prefira peixes com menos mercúrio, como sardinha e salmão
- Evite álcool enquanto estiver tentando engravidar

Lembre-se de que comer bem não precisa ser perfeito. Constância vale mais do que rigidez, e culpa não faz parte do cardápio.`,
  },
  {
    titulo: "As quatro fases do ciclo menstrual, explicadas",
    categoria: "ciclo",
    resumo: "Menstrual, folicular, ovulatória e lútea: o que acontece no seu corpo em cada etapa.",
    conteudo: `O ciclo menstrual vai do primeiro dia de uma menstruação até o dia anterior à próxima. Em média dura 28 dias, mas ciclos entre 21 e 35 dias são considerados comuns em adultas.

## 1. Fase menstrual

Começa no primeiro dia de sangramento. O revestimento do útero (endométrio) descama porque não houve gravidez no ciclo anterior. Costuma durar de 3 a 7 dias.

## 2. Fase folicular

Em paralelo, os ovários preparam folículos sob o comando do hormônio FSH. Um deles se torna dominante, e o estrogênio sobe, deixando o endométrio mais espesso.

## 3. Ovulação

Um pico do hormônio LH faz o folículo liberar o óvulo. Ele vive cerca de 12 a 24 horas, enquanto os espermatozoides podem sobreviver alguns dias no corpo. Por isso a janela fértil inclui os dias **antes** da ovulação.

## 4. Fase lútea

Depois da ovulação, a progesterona prepara o útero para uma possível gestação. Se não houver fecundação, os hormônios caem e um novo ciclo começa.

As previsões do app são estimativas. Cada corpo tem seu ritmo, e ciclos muito irregulares merecem uma conversa com seu médico ou sua médica.`,
  },
  {
    titulo: "Sinais do corpo: como perceber sua janela fértil",
    categoria: "ciclo",
    resumo: "Muco cervical, temperatura e outros sinais que ajudam você a se conhecer melhor.",
    conteudo: `Além do calendário, o próprio corpo dá pistas de que a ovulação está se aproximando. Observar esses sinais com curiosidade, e sem pressão, ajuda você a entender o seu ciclo.

## Muco cervical

Perto da ovulação, a secreção vaginal tende a ficar mais transparente, elástica e escorregadia, parecida com clara de ovo crua. Esse muco facilita o caminho dos espermatozoides.

## Temperatura basal

Medida ao acordar, antes de levantar, a temperatura costuma subir levemente depois da ovulação. Ela confirma que a ovulação aconteceu, mas não a antecipa.

## Outros sinais possíveis

- Aumento da libido
- Leve dor ou pontada em um lado do abdômen
- Seios mais sensíveis

Use o botão **Sintoma** na tela inicial para registrar o que perceber. Com o tempo, seus registros mostram padrões que só você poderia notar. Se tiver dúvidas sobre o que observa, leve suas anotações para a próxima consulta.`,
  },
  {
    titulo: "Fertilidade: quando procurar ajuda especializada",
    categoria: "fertilidade",
    resumo: "Entender o tempo esperado e os sinais de alerta traz mais tranquilidade para a jornada.",
    conteudo: `Engravidar pode levar tempo, e isso é mais comum do que parece. Mesmo com relações na janela fértil, a chance de gravidez em cada ciclo costuma ser de cerca de 20 a 25% para casais jovens e saudáveis.

## A orientação geral

- Mulheres com **menos de 35 anos**: procurar avaliação após 12 meses de tentativas
- Mulheres com **35 anos ou mais**: após 6 meses de tentativas
- Mulheres com **mais de 40 anos**: vale conversar com o médico ou a médica já no início

## Quando não esperar

Procure avaliação mais cedo se houver ciclos muito irregulares ou ausentes, cólicas intensas, histórico de endometriose, cirurgias pélvicas, abortos de repetição ou algum fator conhecido no parceiro.

## A fertilidade é do casal

A investigação deve incluir as duas pessoas. Fatores masculinos estão presentes em uma parcela importante dos casos, e avaliar os dois desde o início poupa tempo e desgaste emocional.

Buscar ajuda não é desistir nem fracassar. É cuidar da sua saúde com informação e apoio.`,
  },
  {
    titulo: "Ansiedade na espera: cuidando da saúde emocional",
    categoria: "estilo_vida",
    resumo: "A espera de cada ciclo mexe com as emoções. Algumas práticas para atravessar esse tempo com mais leveza.",
    conteudo: `A fase tentante costuma ser vivida em ciclos de esperança e expectativa, e é natural que a ansiedade apareça, principalmente nos dias antes da menstruação. Acolher o que você sente é o primeiro passo.

## Práticas que podem ajudar

- **Respiração lenta:** inspire em 4 tempos, segure por 4 e solte em 6. Repita por alguns minutos
- **Movimento:** caminhadas, ioga ou dança ajudam a regular o estresse
- **Sono:** tente manter horários regulares e reduzir telas antes de dormir
- **Limites:** tudo bem não querer responder perguntas sobre "quando vem o bebê"

## Você não precisa passar por isso sozinha

Conversar com quem vive a mesma jornada faz diferença. A comunidade do app é um espaço para isso. Se a tristeza ou a ansiedade estiverem atrapalhando seu dia a dia, procure apoio psicológico: cuidar da mente também é cuidar da fertilidade.

Seja gentil com você. Cada ciclo é só uma parte da sua história.`,
  },
];

const POSTS = [
  "Boas-vindas à nossa comunidade! 💚 Este é um espaço seguro para compartilhar dúvidas, conquistas e desabafos sobre a jornada tentante. Aqui, o respeito e o acolhimento vêm em primeiro lugar. Conta pra gente: há quanto tempo você está nessa jornada?",
  "Pergunta da semana: o que tem ajudado você a lidar com a ansiedade na espera do ciclo? Pode ser uma caminhada, uma série, uma amiga... Compartilhe nos comentários, sua dica pode ajudar outra pessoa hoje.",
  "Lembrete carinhoso: as previsões do app são estimativas, e cada corpo tem seu próprio ritmo. Registrar seus sintomas e seu humor no dia a dia ajuda você a se conhecer, e suas anotações podem ser úteis na próxima consulta. Não deixe de conversar com seu médico ou sua médica!",
];

async function contaEquipe() {
  const { data: lista } = await db.auth.admin.listUsers({ perPage: 1000 });
  const existente = lista?.users.find((u) => u.email === EMAIL_EQUIPE);
  if (existente) return existente.id;
  const { data, error } = await db.auth.admin.createUser({
    email: EMAIL_EQUIPE,
    password: randomBytes(24).toString("base64url"), // conta só para autoria; ninguém faz login nela
    email_confirm: true,
  });
  if (error) throw error;
  return data.user.id;
}

const equipeId = await contaEquipe();
await db.from("profiles").update({ nome: NOME_EQUIPE, nome_exibicao_comunidade: NOME_EQUIPE }).eq("id", equipeId);
// Posts antigos da equipe também passam a usar o nome atual
await db.from("posts").update({ autor_nome: NOME_EQUIPE }).eq("user_id", equipeId);

const { data: existentes } = await db.from("content_items").select("titulo");
const titulos = new Set((existentes ?? []).map((c) => c.titulo));
const novos = CONTEUDOS.filter((c) => !titulos.has(c.titulo)).map((c) => ({ ...c, publicado: true }));
if (novos.length) {
  const { error } = await db.from("content_items").insert(novos);
  if (error) throw error;
}
console.log(`Conteúdos: ${novos.length} criados, ${CONTEUDOS.length - novos.length} já existiam.`);

const { count } = await db.from("posts").select("id", { count: "exact", head: true }).eq("user_id", equipeId);
if (!count) {
  // Horários escalonados para a ordem do feed ficar natural
  const agora = Date.now();
  for (const [i, texto] of POSTS.entries()) {
    const { error } = await db.from("posts").insert({
      user_id: equipeId,
      texto,
      created_at: new Date(agora - (POSTS.length - i) * 3_600_000).toISOString(),
    });
    if (error) throw error;
  }
  console.log(`Posts: ${POSTS.length} criados por "${NOME_EQUIPE}".`);
} else {
  console.log(`Posts: a conta da equipe já tem ${count} post(s); nada criado.`);
}
