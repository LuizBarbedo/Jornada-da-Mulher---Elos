import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";
import { Sobretitulo } from "@/components/ui";
import { DATA_VERSAO_TERMO, VERSAO_TERMO } from "@/lib/consentimento";

export const metadata = { title: "Termos de Uso e Privacidade" };

// RASCUNHO — texto genérico pendente de revisão jurídica antes do lançamento.
export default function Termos() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <Logo />
      <div className="mt-12 flex flex-col gap-3">
        <Sobretitulo>
          Versão {VERSAO_TERMO} · {DATA_VERSAO_TERMO}
        </Sobretitulo>
        <h1 className="text-4xl font-extralight leading-tight">
          Termos de Uso e <span className="font-black">Política de Privacidade</span>
        </h1>
        <p className="rounded-xl bg-rose/10 px-4 py-3 text-xs text-rose">
          Rascunho em revisão jurídica. O texto final será publicado antes do lançamento.
        </p>
      </div>

      <article className="leitura mt-10 text-[15px] leading-relaxed text-grafite/90">
        <h2>1. Sobre o app</h2>
        <p>
          Este aplicativo oferece ferramentas de acompanhamento do ciclo menstrual, conteúdo educativo e
          um espaço de comunidade para mulheres que estão tentando engravidar. As informações têm
          caráter educativo e <strong>não substituem consulta, diagnóstico ou tratamento médico</strong>.
        </p>

        <h2>2. Quais dados tratamos</h2>
        <ul>
          <li>Cadastro: e-mail e senha (armazenada de forma criptografada pelo provedor de autenticação).</li>
          <li>Perfil: nome (opcional), data de nascimento (opcional) e nome de exibição na comunidade.</li>
          <li>
            Dados de saúde (dados pessoais sensíveis, art. 5º, II da LGPD): data da última menstruação,
            duração do ciclo e registros de menstruação, humor, sintomas e observações.
          </li>
          <li>Conteúdo que você publica na comunidade (posts e comentários).</li>
          <li>Registro do seu consentimento (versão do termo e data/hora do aceite).</li>
        </ul>

        <h2>3. Para que usamos</h2>
        <ul>
          <li>Calcular estimativas das fases do seu ciclo e mostrar seu histórico.</li>
          <li>Permitir sua participação na comunidade, identificada apenas pelo nome de exibição.</li>
          <li>Manter a segurança do serviço e moderar conteúdo ofensivo.</li>
        </ul>
        <p>
          Seus dados de saúde não são vendidos, não são usados para publicidade e não são
          compartilhados com terceiros, exceto provedores de infraestrutura necessários para operar o
          app (hospedagem e banco de dados), sob obrigação de confidencialidade.
        </p>

        <h2>4. Base legal</h2>
        <p>
          O tratamento de dados sensíveis de saúde se baseia no seu consentimento específico e
          destacado (art. 11, I da LGPD), que você pode revogar a qualquer momento apagando sua conta.
        </p>

        <h2>5. Seus direitos</h2>
        <ul>
          <li>Acessar e baixar todos os seus dados (Perfil → Exportar meus dados).</li>
          <li>Corrigir seus dados (Perfil → Editar perfil).</li>
          <li>Apagar sua conta e todos os dados associados (Perfil → Apagar minha conta).</li>
          <li>Revogar o consentimento, o que implica a exclusão da conta.</li>
        </ul>

        <h2>6. Segurança</h2>
        <p>
          Os dados são armazenados com controle de acesso por usuária: cada pessoa só consegue ler os
          próprios registros de ciclo. A comunicação é sempre criptografada (HTTPS).
        </p>

        <h2>7. Comunidade</h2>
        <p>
          Seja gentil. Conteúdos ofensivos, discriminatórios, com aconselhamento médico perigoso ou
          propaganda podem ser ocultados pela moderação. Posts com várias denúncias ficam ocultos até
          a revisão da equipe.
        </p>

        <h2>8. Contato</h2>
        <p>Dúvidas sobre privacidade: [e-mail do encarregado de dados — a definir].</p>
      </article>

      <Disclaimer className="mt-12" />
    </main>
  );
}
