# [nome]○ — Jornada Tentantes (MVP)

App web (PWA, mobile-first) para acompanhar a jornada de fertilidade de mulheres que estão tentando engravidar: rastreador de ciclo, comunidade de apoio, conteúdo científico e, em breve, novas jornadas (Gestação, Lactação e Chat com IA científica).

> **Este app não substitui orientação médica.**

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Vercel
**Dependências de runtime:** `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `server-only`.

---

## Sumário

1. [Variáveis de ambiente](#1-variáveis-de-ambiente)
2. [Configurar o Supabase](#2-configurar-o-supabase)
3. [Rodar localmente](#3-rodar-localmente)
4. [Deploy na Vercel](#4-deploy-na-vercel)
5. [Instalar como app (PWA)](#5-instalar-como-app-pwa)
6. [Estrutura do projeto](#6-estrutura-do-projeto)
7. [Segurança e LGPD](#7-segurança-e-lgpd)
8. [Limitações conhecidas e próximos passos](#8-limitações-conhecidas-e-próximos-passos)

---

## 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Onde encontrar | Exposta ao navegador? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` | Sim (protegida pelo RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | **Não. Secreta.** |
| `ADMIN_EMAILS` | Defina você: e-mails separados por vírgula | Não |

A `SUPABASE_SERVICE_ROLE_KEY` ignora o RLS. Ela é usada **somente no servidor** para três coisas: apagar conta (LGPD), painel `/admin` e scripts de seed/teste. Nunca coloque o prefixo `NEXT_PUBLIC_` nela.

## 2. Configurar o Supabase

1. **Banco:** abra **SQL Editor → New query**, cole o conteúdo de [`supabase/migrations/0001_schema.sql`](supabase/migrations/0001_schema.sql) e clique em **Run**. O script cria:
   - as tabelas, com RLS habilitado em todas;
   - os privilégios por coluna;
   - os triggers;
   - o bucket público `conteudo`, para as capas dos conteúdos.
2. **Auth:** em **Authentication → Sign In / Providers → Email**:
   - mantenha *Email* habilitado;
   - para o MVP, recomendamos **desligar "Confirm email"**, para o onboarding seguir direto. Se mantiver ligado, o app envia o link e a pessoa volta pelo endereço `/auth/confirmar`.
3. **URLs:** em **Authentication → URL Configuration**:
   - *Site URL*: `http://localhost:3000` em desenvolvimento, ou a URL da Vercel em produção;
   - *Redirect URLs*: adicione `http://localhost:3000/**` e `https://SEU-APP.vercel.app/**`.

## 3. Rodar localmente

Pré-requisito: Node.js 20 ou superior (testado com o Node 24 LTS).

```bash
npm install
cp .env.example .env.local   # e preencha as variáveis
npm run dev                  # http://localhost:3000
```

Scripts úteis:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run typecheck` | Checagem de tipos |
| `npm run seed` | Cria 6 conteúdos publicados e 3 posts da conta "Equipe [nome]". Pode rodar mais de uma vez: não duplica |
| `npm run testar:rls` | Cria usuárias temporárias e verifica as 21 regras de segurança do banco. Apaga tudo ao final |

**Painel admin:** acesse `/admin`. Só entram contas cujo e-mail esteja em `ADMIN_EMAILS`. Crie a conta normalmente pelo `/cadastro` antes.

## 4. Deploy na Vercel

### Opção A: pelo dashboard, conectando o GitHub (recomendado)

1. Crie um repositório no GitHub e envie o código:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
2. Em [vercel.com/new](https://vercel.com/new), clique em **Import** no repositório. A Vercel detecta o Next.js sozinha.
3. Em **Environment Variables**, cadastre as 4 variáveis da seção 1 para *Production*, *Preview* e *Development*.
4. Clique em **Deploy**. Depois disso, cada `git push` na `main` publica uma nova versão, e cada pull request ganha uma URL de preview.
5. No Supabase, atualize a *Site URL* e as *Redirect URLs* com o domínio da Vercel (ver seção 2.3).

### Opção B: pela CLI

```bash
npx vercel login
npx vercel link                 # cria/vincula o projeto
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add ADMIN_EMAILS
npx vercel                      # deploy de preview
npx vercel --prod               # deploy de produção
```

Em cada `env add`, a CLI pergunta o valor e os ambientes. Selecione *Production*, *Preview* e *Development*. Depois do primeiro deploy, atualize as URLs no Supabase (seção 2.3).

## 5. Instalar como app (PWA)

O app tem manifest, ícones e um service worker mínimo, que só mostra uma tela offline e não guarda dados em cache, por privacidade. O service worker só é registrado em produção (HTTPS).

- **Android (Chrome):** abra o site, toque no menu ⋮ e depois em **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari):** toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

## 6. Estrutura do projeto

```
src/
├─ app/
│  ├─ (onboarding)/      boas-vindas, cadastro, entrar, consentimento, perfil-inicial
│  ├─ (app)/             telas logadas com navegação inferior
│  │  ├─ inicio/         rastreador: fase atual, previsões, registro rápido, calendário
│  │  ├─ comunidade/     feed, post + comentários, denúncia
│  │  ├─ conteudo/       biblioteca e leitura
│  │  ├─ perfil/         editar perfil, exportar dados, apagar conta
│  │  └─ em-breve/[slug] Modo Gestação, Modo Lactação, Chat com IA científica
│  ├─ admin/             login, moderação e CRUD de conteúdos
│  ├─ api/meus-dados/    exportação LGPD (JSON)
│  ├─ termos/            Termos de Uso e Política de Privacidade (rascunho)
│  ├─ manifest.ts, icon.tsx, apple-icon.tsx, icone/[tamanho]   PWA
│  └─ offline/           tela exibida sem conexão
├─ components/           UI da marca (botões, campos, avatar, capa, logo…)
├─ lib/
│  ├─ supabase/          clientes (navegador, servidor, service role) e proxy de sessão
│  ├─ ciclo.ts           cálculo das fases e previsões
│  ├─ moderacao.ts       filtro de termos ofensivos (editável)
│  ├─ validacao.ts       validação e sanitização de entradas
│  └─ marca.ts           nome provisório e texto do disclaimer
└─ proxy.ts              renovação da sessão e proteção de rotas (antigo "middleware")
supabase/migrations/     SQL do banco
scripts/                 seed e teste de RLS
```

**Identidade visual:**
- Tipografia: Raleway nos títulos e ABeeZee no corpo de texto.
- Paleta: verde `#C0D53C`, grafite `#221F1F`, pastel `#F0FED7`, rosé `#A14252`, cinzas `#999999` e `#D9D9D9`.
- Motivo do quadrado arredondado.
- Os tokens ficam em [`src/app/globals.css`](src/app/globals.css).
- **Para trocar o nome provisório `[nome]`**, edite [`src/lib/marca.ts`](src/lib/marca.ts), [`src/components/Logo.tsx`](src/components/Logo.tsx) e `NOME_EQUIPE` em `scripts/seed.mjs`.

## 7. Segurança e LGPD

- **RLS em todas as tabelas.** O papel anônimo não tem nenhum acesso.
  - Cada usuária lê e escreve só o próprio perfil e os próprios registros de ciclo.
  - Posts e comentários são legíveis por usuárias autenticadas e editáveis só pela autora.
  - Conteúdos são visíveis apenas quando publicados.
- **Privilégios por coluna.** A usuária não altera campos como `ativo`, `denuncias_count`, `autor_nome` e `fase_jornada`. Assim, não consegue reativar um post oculto pela moderação.
- **Perfis privados.** O nome de exibição é copiado para `posts.autor_nome` por um trigger. A comunidade nunca lê a tabela `profiles`.
- **Consentimento versionado.** A versão vigente fica em [`src/lib/consentimento.ts`](src/lib/consentimento.ts).
  - Cada aceite é gravado em `consent_logs`.
  - Ao publicar uma nova versão dos termos, troque `VERSAO_TERMO`: todas as usuárias serão levadas a aceitar de novo.
- **Exportar e apagar.**
  - *Exportar meus dados* entrega um JSON completo, sem cache.
  - *Apagar minha conta* remove a usuária do Auth, e tudo é apagado em cascata.
- **Dados de saúde fora da URL e do console.** Os logs registram apenas códigos de erro.
- **Entradas validadas e sanitizadas no servidor.**
  - Remoção de tags HTML e caracteres de controle, com limites de tamanho.
  - Filtro de termos ofensivos.
  - Limite de 10 posts e 30 comentários por hora.
  - O texto é sempre renderizado como texto puro, nunca como HTML.
- **Moderação.**
  - Quem denuncia deixa de ver o post.
  - Com 3 denúncias, o post fica oculto para todas.
  - O admin pode restaurar, ocultar ou apagar.

## 8. Limitações conhecidas e próximos passos

- **Termos de Uso:** o texto em `/termos` é um **rascunho genérico** e precisa de revisão jurídica e dos dados do encarregado (DPO) antes do lançamento.
- **Filtro de termos ofensivos:** roda nas ações do servidor. Uma pessoa autenticada que chame a API do Supabase diretamente com a anon key consegue publicar sem passar pelo filtro, embora continue limitada pelo RLS a publicar só em nome próprio. Para fechar essa brecha, replique a lista num trigger no Postgres ou faça as inserções só pelo servidor.
- **Previsão do ciclo:** é um modelo de calendário simples: ovulação = duração − 14, janela fértil de −5 a +1 dia e menstruação de 5 dias. Não usa o histórico de ciclos anteriores.
- **Imagens dos conteúdos:** o seed não inclui fotos. As capas usam a composição geométrica da marca até que o time envie fotografias reais pelo `/admin`.
- **Idade mínima:** a data de nascimento é opcional e não há bloqueio por idade. Defina a política com o jurídico.
- **Recuperação de senha:** ainda não implementada. O Supabase oferece o fluxo `resetPasswordForEmail`.
