# danieleavolionier

Sito personale basato su SvelteKit.

## Setup

Richiede Node **22.17 o successivo**. Stack: SvelteKit 3, Svelte 5, Vite 8 e
TypeScript 6. Configurazione in `vite.config.ts`, import interni `#lib` e
variabili d'ambiente dichiarate in `src/env.ts`.

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
node scripts/verify-build.mjs
npm run preview
```

La build completa funziona anche su Windows senza privilegi symlink: `npm ci`
applica una patch mirata all'adapter che usa junction solo su Windows, senza
cambiare i symlink Linux/Vercel. `npm run build:preview` resta disponibile per
compilare gli stessi bundle senza il confezionamento Vercel.

## Performance, SEO e test

Le pagine pubbliche aggiornabili usano ISR Vercel con scadenza di 300 secondi;
Data, Appunti e Privacy sono prerenderizzate. L'admin e gli upload restano privati
e senza cache condivisa. Le modifiche ai contenuti possono essere visibili dopo
la successiva rigenerazione, non necessariamente subito dopo il salvataggio.

```bash
npm run lint
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

I test browser usano letture pubbliche del CMS, senza salvare o eliminare contenuti.
Per rigenerare le immagini ottimizzate e le risorse grafiche locali:

```bash
npm run assets:optimize
```

Misure, limiti noti e verifiche prima/dopo il deploy: [Performance e SEO](docs/performance-and-seo.md).
Per gli URL esclusi da Google: [Diagnosi Search Console](docs/search-console.md).
Ranking e UI dei suggerimenti negli articoli: [Leggi anche](docs/related-posts.md).

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
