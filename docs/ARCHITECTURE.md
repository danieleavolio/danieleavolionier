# Mappa del sito

Il sito usa SvelteKit, Supabase e Vercel. La grafica YoRHa è condivisa tra sito
pubblico, admin e anteprima.

| Se devi cambiare…                             | Parti da…                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Articoli, progetti e categorie pubbliche      | `src/routes/pagine/`, `src/routes/progetti/`, `src/lib/server/public-content.ts`                                   |
| Editor admin, anteprima e selezione categorie | `src/routes/admin/`, `src/lib/components/AdminContentEditor.svelte`, `RichTextEditor.svelte`, `PostPreview.svelte` |
| Salvataggio e sanitizzazione                  | `src/lib/server/admin-content.ts`, `src/lib/server/sanitize.ts`                                                    |
| Rendering dei contenuti, grafici e diagrammi  | `src/lib/components/RichContent.svelte`, `src/lib/bar-chart.ts`, `src/lib/mermaid.ts`                              |
| Studio grafici, galleria e contenuti storici  | `ChartStudio.svelte`, `GalleryLightbox.svelte`, `src/lib/rich-gallery.ts`, `src/lib/server/article-repairs.ts`     |
| Tema, palette e componenti YoRHa              | `src/app.css`, `src/lib/styles/yorha-ui.css`                                                                       |
| Accesso privato e upload                      | `src/hooks.server.ts`, `src/routes/admin/`, `src/routes/api/media/`                                                |

## Percorso dei contenuti

L'editor TipTap e l'import da Markdown producono HTML. Il CMS lo sanitizza
prima di salvare `content_html` in Supabase. Gli articoli pubblici leggono da lì,
non dai `.md` locali. L'import dei file usa `scripts/migrate_to_supabase.js`;
quando serve importare un singolo contenuto, verifica prima con
`npm run migrate:content -- --dry-run --slug=<slug>`.

L'anteprima e le pagine pubbliche passano l'HTML a `RichContent`. Il blocco
`bar-chart` produce barre HTML/CSS con valori testuali anche senza JavaScript.
Mermaid resta per i diagrammi: Pele prova a renderizzarli vicino al viewport,
Mermaid.js è il fallback. Il CSS usa i token del tema, non colori scelti
all'interno dell'articolo.

## Blocchi dell'editor

Un blocco speciale è un blocco di codice con un linguaggio. In lettura
`RichContent` lo trasforma in HTML; se il sorgente non è valido resta codice. La
sintassi di ogni blocco sta in `references/blocchi-cms.md` della skill
`articolo-daniele`.

| Pezzo                                                   | File                                                                         | Cosa fa                                                                                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Registro dei blocchi                                    | `src/lib/blocks.ts`                                                          | linguaggio → render; ogni modulo fa `blockRenderers.set(...)` ed è importato in `RichContent`                             |
| Terminale, TL;DR, accordion, timeline, citazione, passi | `src/lib/blocks-content.ts`                                                  | una specifica per blocco: parser, serializzazione, render, campi dello studio                                             |
| Grafici (barre, colonne, linea, torta, anello)          | `src/lib/bar-chart.ts`                                                       | render HTML/CSS con valori testuali                                                                                       |
| Evidenziazione tabelle                                  | `src/lib/table-highlight.ts`                                                 | `data-hl` sulla tabella; migliore/peggiore per colonna, solo lato client                                                  |
| Glossario inline                                        | `src/lib/glossary.ts`                                                        | `[[termine\|definizione]]` nel testo → tooltip; salta codice, link e pulsanti                                             |
| Indice flottante                                        | `TocRail.svelte`                                                             | legge `h2`/`h3` dell'articolo, evidenzia la sezione corrente; visibile solo se c'è spazio (Wide ≥ 104rem, Narrow ≥ 76rem) |
| Cornice degli studi                                     | `BlockStudio.svelte`                                                         | dialogo con controlli, anteprima dal vivo, Annulla/Inserisci                                                              |
| Studi                                                   | `ChartStudio`, `MermaidStudio`, `ContentStudio`, `TableStudio`, `TermStudio` | si registrano in `src/lib/editor/studios.ts` (blocchi) o si aprono dal pulsante (tabella, definizione)                    |

Per aggiungere un blocco: parser e render in un modulo che si registra in
`blocks.ts`, CSS in `RichContent.svelte` con i token del tema, voce in
`studios.ts`, voce nel menu `/` e pulsante in `RichTextEditor.svelte`, test in
`tests/content.test.mjs`, sintassi in `blocchi-cms.md`.

## Confini di pubblicazione

Le pagine pubbliche aggiornabili usano ISR Vercel (300 secondi). Admin e upload
richiedono autenticazione e non usano cache condivise. Per dettagli e verifiche
vedi [Performance e SEO](performance-and-seo.md).
