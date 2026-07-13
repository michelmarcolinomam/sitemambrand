-- Schema inicial do site MAM: contatos, portfólio de cases e storage.
-- Aplicada no projeto "mam-site" (uelrxokvxiqgjdlwhkzw) em 2026-07-12.

create extension if not exists pgcrypto with schema extensions;

-- ————————————————————————————————————————————
-- Admin: único usuário com poder de escrita.
-- ————————————————————————————————————————————
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'email'), '') = 'contato@mamgestao.com'
$$;

-- ————————————————————————————————————————————
-- Contatos (formulário do site) — mesmo desenho do banco antigo.
-- ————————————————————————————————————————————
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  whatsapp text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

grant insert on public.contacts to anon, authenticated;
grant select, delete on public.contacts to authenticated;
grant all on public.contacts to service_role;

create policy "Anyone can submit a contact"
  on public.contacts for insert
  to anon, authenticated
  with check (
    length(name) between 1 and 100
    and length(email) between 3 and 255
    and length(message) between 1 and 2000
    and (company is null or length(company) <= 120)
    and (whatsapp is null or length(whatsapp) <= 30)
  );

create policy "Admin can read contacts"
  on public.contacts for select
  to authenticated
  using (public.is_admin());

create policy "Admin can delete contacts"
  on public.contacts for delete
  to authenticated
  using (public.is_admin());

-- ————————————————————————————————————————————
-- Cases do portfólio de branding.
-- Campos escalares = card na tela de branding; content = página completa.
-- ————————————————————————————————————————————
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  published boolean not null default false,
  sort_order integer not null default 0,
  title text not null,
  year text not null default '',
  category text not null default '',
  descriptor text not null default '',
  cover_url text,
  seo_description text not null default '',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_updated_at
  before update on public.cases
  for each row execute function public.set_updated_at();

alter table public.cases enable row level security;

grant select on public.cases to anon;
grant all on public.cases to authenticated, service_role;

create policy "Published cases are public"
  on public.cases for select
  using (published or public.is_admin());

create policy "Admin manages cases (insert)"
  on public.cases for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin manages cases (update)"
  on public.cases for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manages cases (delete)"
  on public.cases for delete
  to authenticated
  using (public.is_admin());

-- ————————————————————————————————————————————
-- Projetos do carrossel "Mais projetos" (repertório amplo).
-- ————————————————————————————————————————————
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text not null default '',
  category text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_projects enable row level security;

grant select on public.portfolio_projects to anon;
grant all on public.portfolio_projects to authenticated, service_role;

create policy "Published projects are public"
  on public.portfolio_projects for select
  using (published or public.is_admin());

create policy "Admin manages projects (insert)"
  on public.portfolio_projects for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin manages projects (update)"
  on public.portfolio_projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manages projects (delete)"
  on public.portfolio_projects for delete
  to authenticated
  using (public.is_admin());

-- ————————————————————————————————————————————
-- Storage: bucket público de imagens do site.
-- ————————————————————————————————————————————
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site', 'site', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml','image/gif'])
on conflict (id) do nothing;

create policy "Public read of site images"
  on storage.objects for select
  using (bucket_id = 'site');

create policy "Admin uploads site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site' and public.is_admin());

create policy "Admin updates site images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site' and public.is_admin());

create policy "Admin deletes site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site' and public.is_admin());
