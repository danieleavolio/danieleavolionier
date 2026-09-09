# danieleavolionier

Sito personale basato su SvelteKit.

## Setup

```bash
npm install
npm run dev
```

## Supabase CMS

Il sito legge posts, progetti e la pagina Now da Supabase. Duplica `.env.example` in `.env` e valorizza:

```env
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Nel SQL Editor di Supabase esegui prima `supabase_schema.sql` su un progetto nuovo, oppure `supabase/migrations/20260907_content_cms.sql` su un database che contiene già le tabelle `posts` e `projects`.

Nei progetti Supabase creati di recente controlla anche le impostazioni **Data API**: lo schema `public` deve essere esposto perché il sito usa il client Supabase, mentre lo schema `private` deve rimanere non esposto. SQL e policy RLS includono già i grant minimi necessari.

Per importare i contenuti Markdown esistenti senza modificarli:

```bash
npm run migrate:content -- --dry-run
npm run migrate:content
```

La service key serve solo allo script di migrazione e alle API server-side; non va mai esposta nel browser o committata. Per entrare nell'editor crea un utente Email/Password in Supabase Auth, poi inserisci il suo UUID nella tabella `admin_users`:

```sql
insert into public.admin_users (user_id) values ('UUID_DELL_UTENTE');
```

Dopo il deploy l'editor visuale è disponibile su `/admin/login`; da lì puoi creare e modificare posts, progetti e aggiornamenti Now senza scrivere Markdown.

## Build

```bash
npm run check
npm run build
npm run preview
```

## Nuovi contenuti

Crea bozza post:

```bash
npm run new:post -- nome-slug "Titolo del post"
```

Crea bozza progetto:

```bash
npm run new:project -- nome-slug "Titolo del progetto"
```

Il comando genera un file markdown in `src/posts` o `src/progetti` con frontmatter standard.

## Deploy

Gli hook Husky sono configurati per:

- `pre-commit`: esecuzione `lint-staged`
- `post-commit`: `git push` automatico

Questo consente il deploy su push senza usare script manuali.
