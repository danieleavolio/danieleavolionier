-- Traduzioni degli articoli (per ora solo inglese). Una riga per articolo e lingua.
-- `slug` non è una chiave esterna: se rinomini un articolo la traduzione si rigenera
-- da sola e la riga vecchia viene cancellata dal salvataggio.
-- `source_hash` è l'impronta dell'italiano tradotto: se cambia, si ritraduce.
create table if not exists public.translations (
  slug text not null,
  lang text not null check (lang ~ '^[a-z]{2}$'),
  title text not null,
  description text not null default '',
  content_html text not null,
  source_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, lang)
);

drop trigger if exists translations_set_updated_at on public.translations;
create trigger translations_set_updated_at before update on public.translations
for each row execute function public.set_updated_at();

alter table public.translations enable row level security;

-- Il pubblico legge solo la traduzione di articoli pubblicati.
drop policy if exists "Public translations of published posts are readable" on public.translations;
create policy "Public translations of published posts are readable" on public.translations
for select to anon, authenticated using (
  exists (select 1 from public.posts p where p.slug = translations.slug and p.published = true)
);

drop policy if exists "Admins read translations" on public.translations;
create policy "Admins read translations" on public.translations
for select to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage translations" on public.translations;
create policy "Admins manage translations" on public.translations
for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

grant select on public.translations to anon, authenticated;
grant insert, update, delete on public.translations to authenticated;
