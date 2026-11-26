# Progress: editor, copertine, bozze

Stato al 25 novembre 2026. Niente di questo è committato: il post-commit pusha e Vercel pubblica, quindi serve il via di Daniele.

## Già committato

- `356fcc6` CV, lastmod reale, HANDOFF.
- `62f358e` redesign admin, pagine larghe per 16:9.
- `b3ef599` footer a due righe.

## Fatto, non committato

- **Autosave bozza** (`src/lib/editor/draft-storage.ts`, `AdminContentEditor.svelte`): bozza in localStorage per slug, banner Ripristina/Scarta, bozza cancellata dopo un salvataggio riuscito. Verificato nel browser.
- **Anteprima affiancata** (≥1200px): editor a sinistra, anteprima a destra aggiornata dopo 500 ms. Verificata a 1920 e 390.
- **Studio copertine** (`CoverStudio.svelte`, `src/lib/editor/cover-render.ts`): canvas, PNG caricato come `item.image` dal pannello 03. Verificato: apre, errore di upload tiene aperto il dialogo, Esc chiude. Montato solo quando è aperto (evitava un errore di hydration).
- **Grassetto che non si vedeva**: il body è a peso 300 e `strong` arrivava solo a 400. Ora Manrope 700 importato in `src/app.css` e `strong, b { font-weight: 700 }`. Verificato: peso 700.
- **Editor più snello** (`RichTextEditor.svelte`):
  - toolbar a gruppi (testo, struttura, inserisci, studi), con pulsanti compatti, barrato e codice in linea;
  - menu flottante sulla selezione (B, I, U, codice, link);
  - caret rosso a blocco, bordo evidenziato quando si scrive;
  - Ctrl+G = grassetto, Ctrl+K = link (la ricerca del sito salta il tasto se l'editor l'ha già gestito, `SearchModal.svelte`);
  - stato attivo dei pulsanti che segue il cursore.
- **Pannello di inserimento** (`InsertPanel.svelte`) al posto dei `window.prompt`: Link (testo + indirizzo, modifica e rimuovi), Immagine (URL o upload, descrizione, anteprima), Video, Embed, Galleria (URL o upload multiplo, miniature).
- **Link meno pesanti** nel testo di articoli ed editor: minuscolo, sottolineatura sottile, riempimento NieR solo in hover (fondo di `src/app.css`).
- **Crea immagine** nella toolbar: apre lo studio in modalità `inline` e inserisce il PNG nel testo.

Test di prova passati in `tests/.rte.tmp.mjs`: grassetto 700, Ctrl+G, bubble, dialogo link con testo precompilato, immagine, galleria con miniature, studio immagini.

## Da fare

1. Controllare a occhio gli screenshot già fatti (`rte-bubble.png`, `rte-image.png`) e ritoccare toolbar e dialoghi se serve. La seconda riga della toolbar va a capo sotto i 1440px: valutare.
2. Mermaid più guidato, senza sintassi: scelta del tipo (flusso, sequenza, gantt…), nodi e collegamenti da form. Non iniziato.
3. Altri elementi per creare: immagini con didascalia, layout colonne. Non iniziato.
4. Pulizia temporanei prima di committare:
   - `src/routes/editor-harness-tmp/`
   - `tests/.rte.tmp.mjs`
   - `tests/.editor.tmp.mjs` e `tests/.cover-int.tmp.mjs` (già rimossi)
5. `npm run check:full` a modifiche chiuse. L'ultimo giro (prima delle modifiche all'editor) era verde: 47 passati, 3 saltati.
6. Aggiornare `docs/HANDOFF.md`.
7. Chiedere il commit (pusha).

## Promemoria per Daniele

- Incollare nell'admin l'articolo riscritto (Unical, data engineer).
- Togliere i permessi admin a `claude@admin.it` dopo i test.
- Risottomettere la sitemap e esportare gli URL esclusi da Search Console.
- Aperta: sintesi di suoni UI al posto dei `core_*.ogg` di NieR (non scaricati né ospitati), in attesa di un sì.

## Vincoli

- Non toccare `docs/bozze/`, `docs/prototypes/`, `static/images/projects/`.
- Non committare `.claude/launch.json` né le differenze di EOL in `.husky`.
- Il dev server usa il Supabase di produzione: niente salvataggi o cancellazioni di contenuti reali.
- Import `#lib`, non `$lib`. Dev server: `preview_start` con "dev" (porta 5199). Dopo aver creato route nuove, riavviarlo (Vite serviva una pagina vecchia).
