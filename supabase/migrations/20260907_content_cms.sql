-- Astra CMS: database-backed content and Supabase Auth.
-- Apply this file in the Supabase SQL editor before using /admin.

create extension if not exists "uuid-ossp";

create table if not exists public.posts (
  slug text primary key,
  title text not null,
  description text not null default '',
  date date not null default current_date,
  image text,
  categories text[] not null default '{}',
  published boolean not null default false,
  content text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  slug text primary key,
  title text not null,
  description text not null default '',
  date date not null default current_date,
  image text,
  categories text[] not null default '{}',
  published boolean not null default true,
  content text,
  created_at timestamptz not null default now()
);

alter table if exists public.posts add column if not exists content_html text;
alter table if exists public.posts add column if not exists content_json jsonb;
alter table if exists public.posts add column if not exists legacy_content text;
alter table if exists public.posts add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table if exists public.posts add column if not exists image text;
alter table if exists public.posts add column if not exists published boolean not null default false;
alter table if exists public.posts add column if not exists updated_at timestamptz not null default now();

alter table if exists public.projects add column if not exists content_html text;
alter table if exists public.projects add column if not exists content_json jsonb;
alter table if exists public.projects add column if not exists legacy_content text;
alter table if exists public.projects add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table if exists public.projects add column if not exists image text;
alter table if exists public.projects add column if not exists published boolean not null default true;
alter table if exists public.projects add column if not exists updated_at timestamptz not null default now();

create table if not exists public.now_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  category text not null default 'In corso',
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  link text,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists now_items_set_updated_at on public.now_items;
create trigger now_items_set_updated_at before update on public.now_items
for each row execute function public.set_updated_at();

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.now_items enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public published posts are readable" on public.posts;
create policy "Public published posts are readable" on public.posts
for select to anon, authenticated using (published = true);

drop policy if exists "Admins read posts" on public.posts;
create policy "Admins read posts" on public.posts
for select to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts" on public.posts
for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy if exists "Public published projects are readable" on public.projects;
create policy "Public published projects are readable" on public.projects
for select to anon, authenticated using (published = true);

drop policy if exists "Admins read projects" on public.projects;
create policy "Admins read projects" on public.projects
for select to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy if exists "Public published Now items are readable" on public.now_items;
create policy "Public published Now items are readable" on public.now_items
for select to anon, authenticated using (published = true);

drop policy if exists "Admins read Now items" on public.now_items;
create policy "Admins read Now items" on public.now_items
for select to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage Now items" on public.now_items;
create policy "Admins manage Now items" on public.now_items
for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy if exists "Admins can read their admin record" on public.admin_users;
create policy "Admins can read their admin record" on public.admin_users
for select to authenticated using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.posts, public.projects, public.now_items to anon, authenticated;
grant insert, update, delete on public.posts, public.projects, public.now_items to authenticated;
grant select on public.admin_users to authenticated;

-- Remove the previous exposed helper when upgrading from the first CMS migration.
drop function if exists public.is_admin();

create index if not exists posts_published_date_idx on public.posts (published, date desc);
create index if not exists projects_published_date_idx on public.projects (published, date desc);
create index if not exists now_items_public_position_idx on public.now_items (published, position, updated_at desc);
