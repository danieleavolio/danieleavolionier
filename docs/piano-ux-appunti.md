# Piano: UX desktop/mobile + Appunti su Supabase con admin

## Contesto
- In Wide la colonna articolo non ha limite (`--reading-width` esiste solo in Narrow, `src/app.css:524`), quindi la cover (`img.cover-image`, senza max-height) diventa enorme e il testo corre su righe lunghissime (fino a 1440/1680px).
- Il toggle Wide/Narrow (`ReadingWidth.svelte`) sta *sotto* la cover: non serve al primo colpo d'occhio.
- Altri attriti: focus ring rimosso (`app.css:47`), testo giustificato su mobile, header con hamburger già a ≤1300px, padding laterale fisso ~2rem anche su telefono, filtro categorie con scroll annidato, nessun indice né "torna su" flottante.
- Appunti: lista hardcoded in `src/lib/notes_files_desc.ts` (13 voci, 8 PDF in `static/files`), pagina prerender, nessuna categoria, nessuna gestione admin.

Si procede in 3 fasi indipendenti, ognuna pubblicabile da sola.

---

## Fase 1 — Pagina articolo/progetto (il problema dello screenshot)
File: `src/routes/pagine/[slug]/+page.svelte`, `src/routes/progetti/[slug]/+page.svelte`, `src/lib/components/ReadingWidth.svelte`, `src/app.css`.

1. **Wide con un tetto**: definire `--reading-width` anche di default (es. `72rem`), Narrow resta `44rem`. Il testo non supera mai ~90 caratteri.
2. **Cover contenuta**: `max-height: min(60vh, 34rem)`, `aspect-ratio` 1200/630, `object-fit: cover`; in Narrow la cover segue la colonna.
3. **Toggle spostato in alto**: dentro la riga meta (data · tempo di lettura · `WIDE | NARROW`) dentro l'`hgroup`, prima della cover. Stile compatto YoRHa, attivo con `--yr-accent` ma senza il blocco pieno scuro; tap target ≥ 2.25rem.
4. Verifica: screenshot 1440px e 1920px in Wide/Narrow, 390px mobile.

## Fase 2 — Ritocchi UX globali (piccoli, mirati)
File: `src/app.css`, `src/routes/+layout.svelte`, `src/routes/header.svelte`, `src/lib/components/CategoriesFilter.svelte`, `src/routes/footer.svelte`.

1. **Accessibilità**: sostituire `*:focus{outline:none!important}` con `:focus-visible` outline in `--yr-accent`.
2. **Mobile leggibile**: `text-align: left` per `.prose p` sotto 800px; `line-height` relativo (1.75) invece di 2.3rem fisso; padding laterale `.layout` ridotto a `var(--size-4)` sotto 560px; `main` padding-block ridotto su mobile.
3. **Titoli lunghi**: letter-spacing ridotto e `text-wrap: balance` su h1 sotto 800px.
4. **Header**: nav desktop visibile fino a ~1000px (oggi sparisce a 1300px), hamburger/home con padding per tap target ≥ 44px.
5. **Filtro categorie su mobile**: niente scroll interno; lista a chip orizzontali scorrevoli (wrap) quando aperto.
6. **"Torna su" flottante** sulle pagine articolo dopo ~1 schermata di scroll (piccolo bottone YoRHa in basso a destra). Indice (TOC) rinviato: lo valutiamo dopo.

## Fase 3 — Appunti su Supabase, con categorie e admin
Pattern da copiare: `now_items` (`src/routes/admin/now/+page.server.ts` + `+page.svelte`, `listNowItems` in `src/lib/server/public-content.ts:116`, blocco SQL in `supabase/migrations/20260907_content_cms.sql`).

1. **Migrazione** `supabase/migrations/2026xxxx_notes.sql` (da applicare a mano nel SQL editor, come le altre):
   - tabella `notes(id uuid pk, title, description, category text, file_url text, file_path text null, position int, published bool default true, created_at, updated_at)`, trigger `set_updated_at`, RLS (pubblico legge `published`, admin `for all` via `private.is_admin()`), grant e indice su `(category, position)`.
   - bucket pubblico `notes` con policy read pubblica / manage admin (modello `20261026_post_images_storage.sql`), limite PDF es. 50 MB.
   - seed delle 13 voci con categoria (es. Magistrale / Triennale / Guide).
2. **Upload PDF senza passare da Vercel**: endpoint `src/routes/api/notes-upload/+server.ts` (admin) che restituisce un `createSignedUploadUrl` sul bucket `notes`; il browser carica il file direttamente. Aggiungere il path a `needsAuth` in `src/hooks.server.ts`. Alla rimozione/sostituzione si cancella anche `file_path` dallo storage.
3. **Migrazione file**: script una tantum `scripts/migrate-notes.mjs` (dry-run di default) che carica gli 8 PDF di `static/files` nel bucket e aggiorna `file_url`/`file_path`. Dopo la verifica in produzione si possono togliere i PDF da `static/files` (passo separato, su richiesta).
4. **Admin** `src/routes/admin/appunti/+page.server.ts` + `+page.svelte` (copia di `now`): lista per categoria, form con titolo, descrizione, categoria (input con `datalist` delle esistenti), link esterno *oppure* upload PDF, ordine, pubblicato; azioni `save`/`remove`. Tab in `admin/+layout.svelte:7-12`, card in `admin/+page.svelte`.
5. **Pagina pubblica** `src/routes/appunti/`: `+page.server.ts` da prerender a ISR 300s con `listNotes(locals.supabase)` (nuova in `public-content.ts`); `+page.svelte` raggruppa per categoria con chip filtro in alto e ricerca testuale; `NotesHolder.svelte` passa a Svelte 5 props, mostra categoria e badge PDF/Link.
6. **Ricerca**: aggiungere i notes a `src/routes/search.json/+server.ts` e far leggere `src/lib/search.ts` da lì; poi eliminare `src/lib/notes_files_desc.ts`. Endpoint morto `src/routes/api/files/` + `static/files/files.json`: rimozione da proporre, non inclusa.

---

## Verifica
- Durante il lavoro: dev server + browser pane a 390px, 768px, 1440px, 1920px, Wide e Narrow; screenshot prima/dopo della pagina dello screenshot.
- Appunti: creare/modificare/cancellare una nota di prova dall'admin, upload di un PDF > 5 MB, controllare la pagina pubblica, filtro categoria e ricerca (SearchModal).
- A fine lavoro: `npm run check:full` una volta.
- Niente commit/push senza richiesta (il post-commit pubblica). La migrazione SQL la applichi tu nel SQL editor Supabase.
