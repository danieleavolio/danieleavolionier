-- Appunti: lista gestita dall'admin, con categorie e PDF nel bucket pubblico `notes`.
-- I PDF vengono caricati dal browser con un URL firmato (non passano da Vercel).
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  category text not null default 'Altro',
  file_url text not null,
  file_path text,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at before update on public.notes
for each row execute function public.set_updated_at();

alter table public.notes enable row level security;

drop policy if exists "Public published notes are readable" on public.notes;
create policy "Public published notes are readable" on public.notes
for select to anon, authenticated using (published = true);

drop policy if exists "Admins read notes" on public.notes;
create policy "Admins read notes" on public.notes
for select to authenticated using ((select private.is_admin()));

drop policy if exists "Admins manage notes" on public.notes;
create policy "Admins manage notes" on public.notes
for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

grant select on public.notes to anon, authenticated;
grant insert, update, delete on public.notes to authenticated;

create index if not exists notes_category_position_idx on public.notes (category, position);

-- Bucket pubblico per i PDF (max 50 MB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
values ('notes', 'notes', true, 52428800, array['application/pdf'], now(), now())
on conflict (id) do update
set public = true, file_size_limit = 52428800, allowed_mime_types = array['application/pdf'];

drop policy if exists "Public can read notes files" on storage.objects;
create policy "Public can read notes files" on storage.objects
for select to anon, authenticated
using (bucket_id = 'notes');

drop policy if exists "Admins manage notes files" on storage.objects;
create policy "Admins manage notes files" on storage.objects
for all to authenticated
using (bucket_id = 'notes' and (select private.is_admin()))
with check (bucket_id = 'notes' and (select private.is_admin()));

-- Seed iniziale: solo se la tabella è vuota. I PDF puntano ancora a /files/ finché
-- non lanci scripts/migrate-notes.mjs.
insert into public.notes (title, description, category, file_url, position)
select v.title, v.description, v.category, v.file_url, v.position
from (values
  ('Python Handbook', 'Handbook scritto da me medesimo per dare una mano a chiunque voglia imparare Python. Contiene argomenti base che possono essere utili per chiunque voglia iniziare a programmare in Python.', 'Guide', '/files/Handbook.pdf', 0),
  ('Reti e Sicurezza Informatica', 'Appunti del corso di Reti di Calcolatori dell''anno 2020/2021. Nota che potrebbero esserci errori e/o incompletezze poiché vecchi di qualche anno.', 'Triennale', '/files/RETI-RIASSUNTO.pdf', 0),
  ('Massive Parallel Programming On GPUs', 'Appunti del corso di MPPG anno 2022/2023 del Prof. D''Ambrosio', 'Magistrale', '/files/MppGPU%20Theory.pdf', 0),
  ('Statistical Methods for Data Science', 'Appunti scritti per il corso di SMFDS della Prof.ssa Sabrina Giordano. Potrebbero esserci degli errori e alcuni argomenti potrebbero essere non esaustivi!', 'Magistrale', 'https://www.notion.so/danieleavolio/Links-PDF-Statistica-a06aafe5ff444dd3934cd8fb1c325168?pvs=4', 1),
  ('Optimization for Machine Learning', 'Appunto scritti per il corso di Optimization for Machine Learning del Prof. Antonio Fuduli dell''anno 2023/2024. Alcuni passaggi potrebbero contenere dei piccoli errori, quindi attenzione con il ragionamento.', 'Magistrale', 'https://drive.google.com/file/d/1DVSHWchtMysazzqjV-r_60r1a5QIpWvY/view?usp=sharing', 2),
  ('Process Mining', 'Appunti del corso di Process Mining anno 2022/2023 della Prof.ssa Fionda', 'Magistrale', 'https://danieleavolio.notion.site/b5d4ff6c051145ccb93f2c26ec8c91d8?v=d300f029d15b4e40b6f6dd073e528ad3&pvs=4', 3),
  ('Machine Learning', 'Appunti del corso di Machine Learning anno 2022/2023 del Prof. Rullo', 'Magistrale', 'https://danieleavolio.notion.site/64c8929bf3b24680be86ef03c21fa002?v=58b4348d527c45c1bd67621a2d149f83&pvs=4', 4),
  ('Data Warehouse and Visualization', 'Appunti del corso di Data Warehouse and Visualization anno 2022/2023 del Prof. Terracina', 'Magistrale', 'https://danieleavolio.notion.site/6d70a5abdbdf40bc87b9750860ff1143?v=670c12862a95499f95b8f768a8b32c83&pvs=4', 5),
  ('Theoretical Computer Science', 'Domande e risposte delle slides anno 2022/2023', 'Magistrale', '/files/tcs_questions.pdf', 6),
  ('Deep Learning', 'Appunti del corso di Deep Learning anno 2022/2023', 'Magistrale', '/files/DeepLearning.pdf', 7),
  ('Algorithmic Game Theory', 'Appunti di teoria e laboratorio di AGT anno 2022/2023 con incompletezza in alcuni argomenti esageratamente complessi', 'Magistrale', '/files/AlgorithmicGameTheory.pdf', 8),
  ('Big Data and Reasoning - Domande e Risposte teoria', 'Domande e risposte che ho creato autonomamente per preparare l''esame di Big Data and Reasoning, assolutamente non esaustive', 'Magistrale', '/files/bigdata_questions.pdf', 9),
  ('Big Data and Reasoning - Domande e Risposte laboratorio', 'Domande e risposte sulla parte riguardante il laboratorio di Big Data, anche queste non esaustive e molto teoriche', 'Magistrale', '/files/bigdata_lab.pdf', 10)
) as v(title, description, category, file_url, position)
where not exists (select 1 from public.notes);
