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

## Confini di pubblicazione

Le pagine pubbliche aggiornabili usano ISR Vercel (300 secondi). Admin e upload
richiedono autenticazione e non usano cache condivise. Per dettagli e verifiche
vedi [Performance e SEO](performance-and-seo.md).
