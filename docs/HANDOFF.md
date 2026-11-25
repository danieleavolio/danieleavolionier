# Ripartenza: editor e SEO

Il piano completo sta nel progetto Claude "Sito Web Daniele Avolio", in
`claude/piano-editor-e-seo.md`. Qui c'è solo lo stato al 24 novembre 2026.

## Già online

| Commit | Fase |
|---|---|
| `75c2ab8` | 0: Studio grafici, galleria, grading, categorie, copertina |
| `af20a93` | 1: Studio Mermaid con anteprima ed errori con il numero di riga |
| `6b97519` | 2 e 3: tabelle, box di nota (`info`, `warning`, `tip`), menu `/` |

`main` è allineato con `origin/main`.

## Editor: cosa manca

Fasi 4 e 5 fatte: salvataggio automatico della bozza in `localStorage`
(`src/lib/editor/draft-storage.ts`) e anteprima affiancata da 1200px. In più: Studio
copertine (`CoverStudio.svelte`), pannello di inserimento (`InsertPanel.svelte`),
toolbar a gruppi e menu flottante nell'editor.

Da fare, nessuna nuova dipendenza:

- Mermaid guidato da form (tipo di diagramma, nodi, collegamenti), senza sintassi.
- Immagini con didascalia e layout a colonne.
- Valutare la seconda riga della toolbar, che va a capo sotto i 1440px.

## SEO: cosa manca

Lato tecnico il sito è a posto. Il 24/11 le 29 URL della sitemap rispondevano
tutte 200 con HTML renderizzato lato server, `canonical` corretto e nessun
`noindex`. Anche i link interni di home, `/pagine`, `/progetti`, `/appunti`,
`/data` e `/now` rispondevano tutti 200. Il problema è che Google conosce gli
articoli ma non li considera abbastanza da indicizzarli.

Search Console riporta 14 URL "Rilevata, ma non indicizzata" e 3 "Scansionata, ma
non indicizzata".

Gli interventi, dal più sicuro:

1. ~~`noindex` su `/end-of-the-lova`~~: c'era già, è l'header `X-Robots-Tag` in
   `src/hooks.server.ts`.
2. ~~Header `Link: rel="canonical"` da `CV-DA.pdf` a `/cv`~~: fatto. Il PDF sta in
   `src/lib/assets/` e lo serve `src/routes/CV-DA.pdf/+server.ts`. Per aggiornare
   il CV sostituisci quel file.
3. Link interni dalla home e da `/progetti` verso gli articoli, con i testi
   scritti nella voce di Daniele.
4. Daniele chiede a mano l'indicizzazione delle 5 pagine principali.
5. Per le 3 pagine scartate (probabilmente `first-website`, `second-website` e
   `youtube-downloader`): ampliarle, unirle o metterle in `noindex`. Decide Daniele.
6. Titolo e description della home per le ricerche senza il nome.
7. ~~Togliere editor e Mermaid dal bundle pubblico~~: non serviva. Il chunk da
   1,5 MB è `elk` di Mermaid, caricato solo su richiesta. Mermaid si carica solo
   se l'articolo contiene un diagramma, e l'editor solo nelle route admin.

Fatto anche: i `lastmod` e i `dateModified` non usano più gli `updated_at` della
migrazione del 9 settembre 2026 (`realUpdatedAt` in
`src/lib/server/article-repairs.ts`). Per quegli articoli si usa la data di
pubblicazione.

## Scrittura

Per gli articoli c'è la skill Claude personale `articolo-daniele` in
`~/.claude/skills/`, fuori dal repository. Contiene la voce, brani veri presi
dagli articoli e la sintassi dei blocchi del CMS.
