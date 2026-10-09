-- ════════════════════════════════════════════════════════════════════
-- Jornada Tentantes — schema inicial
-- Execute no Supabase: SQL Editor → New query → cole tudo → Run.
-- O script é idempotente apenas na criação do bucket; rode uma única vez
-- em um banco limpo.
-- ════════════════════════════════════════════════════════════════════

-- ─── Tabelas ────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 80),
  data_nascimento date,
  data_ultima_menstruacao date,
  duracao_ciclo_dias smallint not null default 28
    check (duracao_ciclo_dias between 21 and 45),
  fase_jornada text not null default 'tentante'
    check (fase_jornada in ('tentante', 'gestante', 'lactante')),
  nome_exibicao_comunidade text
    check (char_length(nome_exibicao_comunidade) between 2 and 30),
  created_at timestamptz not null default now()
);

create table public.cycle_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data date not null,
  tipo text not null check (tipo in ('menstruacao', 'sintoma', 'humor', 'observacao')),
  -- opção escolhida no chip (ex.: "Ansiosa", "Cólica"); opcional
  valor text check (char_length(valor) <= 60),
  texto_livre text check (char_length(texto_livre) <= 500),
  created_at timestamptz not null default now()
);
create index cycle_logs_user_data_idx on public.cycle_logs (user_id, data);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- cópia do nome de exibição (perfis são privados; ver trigger abaixo)
  autor_nome text not null default 'Tentante',
  texto text not null check (char_length(texto) between 1 and 1000),
  created_at timestamptz not null default now(),
  ativo boolean not null default true,
  denuncias_count integer not null default 0
);
create index posts_created_at_idx on public.posts (created_at desc);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  autor_nome text not null default 'Tentante',
  texto text not null check (char_length(texto) between 1 and 500),
  created_at timestamptz not null default now(),
  ativo boolean not null default true
);
create index comments_post_idx on public.comments (post_id, created_at);

create table public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  motivo text check (char_length(motivo) <= 200),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 140),
  categoria text not null check (categoria in ('nutricao', 'ciclo', 'fertilidade', 'estilo_vida')),
  resumo text check (char_length(resumo) <= 300),
  conteudo text not null,
  url_imagem text,
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  versao_termo text not null check (char_length(versao_termo) <= 20),
  aceito_em timestamptz not null default now()
);
create index consent_logs_user_idx on public.consent_logs (user_id, aceito_em desc);

-- ─── RLS: habilitado em TODAS as tabelas ───────────────────────────

alter table public.profiles       enable row level security;
alter table public.cycle_logs     enable row level security;
alter table public.posts          enable row level security;
alter table public.comments       enable row level security;
alter table public.post_reports   enable row level security;
alter table public.content_items  enable row level security;
alter table public.consent_logs   enable row level security;

-- Nada para o papel anônimo (defesa em profundidade além do RLS).
revoke all on public.profiles, public.cycle_logs, public.posts, public.comments,
  public.post_reports, public.content_items, public.consent_logs from anon;

-- Privilégios por coluna: usuárias autenticadas só alteram o que faz
-- sentido. Campos como ativo, denuncias_count, autor_nome e created_at
-- ficam sob controle de triggers / service role.
revoke insert, update on public.profiles from authenticated;
grant update (nome, data_nascimento, data_ultima_menstruacao, duracao_ciclo_dias,
  nome_exibicao_comunidade) on public.profiles to authenticated;

revoke insert, update on public.posts from authenticated;
grant insert (user_id, texto) on public.posts to authenticated;
grant update (texto) on public.posts to authenticated;

revoke insert, update on public.comments from authenticated;
grant insert (post_id, user_id, texto) on public.comments to authenticated;
grant update (texto) on public.comments to authenticated;

revoke insert, update, delete on public.post_reports from authenticated;
grant insert (post_id, user_id, motivo) on public.post_reports to authenticated;

revoke insert, update, delete on public.content_items from authenticated;

revoke insert, update, delete on public.consent_logs from authenticated;
grant insert (user_id, versao_termo) on public.consent_logs to authenticated;

-- profiles: só o próprio registro (criado pelo trigger de cadastro)
create policy "profiles: ler o próprio" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: editar o próprio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- cycle_logs: só os próprios registros
create policy "cycle_logs: ler os próprios" on public.cycle_logs
  for select to authenticated using (user_id = (select auth.uid()));
create policy "cycle_logs: criar os próprios" on public.cycle_logs
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "cycle_logs: editar os próprios" on public.cycle_logs
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "cycle_logs: apagar os próprios" on public.cycle_logs
  for delete to authenticated using (user_id = (select auth.uid()));

-- posts: leitura por autenticadas (ativos, ou os próprios); escrita só autora
create policy "posts: ler ativos ou próprios" on public.posts
  for select to authenticated using (ativo or user_id = (select auth.uid()));
create policy "posts: criar como autora" on public.posts
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "posts: editar os próprios" on public.posts
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "posts: apagar os próprios" on public.posts
  for delete to authenticated using (user_id = (select auth.uid()));

-- comments: visíveis se o post é visível; escrita só autora
create policy "comments: ler ativos ou próprios" on public.comments
  for select to authenticated using (
    (ativo or user_id = (select auth.uid()))
    and exists (select 1 from public.posts p where p.id = post_id)
  );
create policy "comments: criar como autora em post ativo" on public.comments
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.posts p where p.id = post_id and p.ativo)
  );
create policy "comments: editar os próprios" on public.comments
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "comments: apagar os próprios" on public.comments
  for delete to authenticated using (user_id = (select auth.uid()));

-- post_reports: cada usuária cria e vê apenas as próprias denúncias
create policy "post_reports: ler as próprias" on public.post_reports
  for select to authenticated using (user_id = (select auth.uid()));
create policy "post_reports: denunciar" on public.post_reports
  for insert to authenticated with check (user_id = (select auth.uid()));

-- content_items: publicados, só para autenticadas
create policy "content_items: ler publicados" on public.content_items
  for select to authenticated using (publicado);

-- consent_logs: leitura do próprio + registro do próprio aceite (sem editar/apagar)
create policy "consent_logs: ler os próprios" on public.consent_logs
  for select to authenticated using (user_id = (select auth.uid()));
create policy "consent_logs: registrar o próprio aceite" on public.consent_logs
  for insert to authenticated with check (user_id = (select auth.uid()));

-- ─── Triggers ───────────────────────────────────────────────────────

-- Cria o perfil vazio ao cadastrar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Preenche autor_nome em posts/comentários a partir do perfil
create or replace function public.set_autor_nome()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select coalesce(p.nome_exibicao_comunidade, 'Tentante')
    into new.autor_nome
    from public.profiles p where p.id = new.user_id;
  new.autor_nome := coalesce(new.autor_nome, 'Tentante');
  return new;
end;
$$;

create trigger posts_set_autor_nome before insert on public.posts
  for each row execute function public.set_autor_nome();
create trigger comments_set_autor_nome before insert on public.comments
  for each row execute function public.set_autor_nome();

-- Propaga mudança do nome de exibição
create or replace function public.propagar_nome_exibicao()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.nome_exibicao_comunidade is distinct from old.nome_exibicao_comunidade then
    update public.posts set autor_nome = coalesce(new.nome_exibicao_comunidade, 'Tentante')
      where user_id = new.id;
    update public.comments set autor_nome = coalesce(new.nome_exibicao_comunidade, 'Tentante')
      where user_id = new.id;
  end if;
  return new;
end;
$$;

create trigger profiles_propagar_nome after update on public.profiles
  for each row execute function public.propagar_nome_exibicao();

-- Denúncias: contabiliza e oculta automaticamente com 3 ou mais
create or replace function public.contabilizar_denuncia()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.posts
     set denuncias_count = denuncias_count + 1,
         ativo = case when denuncias_count + 1 >= 3 then false else ativo end
   where id = new.post_id;
  return new;
end;
$$;

create trigger post_reports_contabilizar after insert on public.post_reports
  for each row execute function public.contabilizar_denuncia();

-- updated_at em content_items
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger content_items_touch before update on public.content_items
  for each row execute function public.touch_updated_at();

-- Funções de trigger não devem ser chamáveis via API
revoke execute on function public.handle_new_user(), public.set_autor_nome(),
  public.propagar_nome_exibicao(), public.contabilizar_denuncia(),
  public.touch_updated_at() from public, anon, authenticated;

-- Perfis para usuárias que já existam antes desta migration
insert into public.profiles (id) select id from auth.users on conflict do nothing;

-- ─── Storage: imagens dos conteúdos (públicas, não são dados de saúde) ─
-- Upload só pelo servidor (service role) via painel /admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('conteudo', 'conteudo', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
