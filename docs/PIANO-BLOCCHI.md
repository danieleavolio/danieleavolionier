# Piano: nuovi blocchi per l'editor

Spunta `[x]` quando una voce è fatta **e verificata** (comportamento provato, non solo scritto). Lavora una fase alla volta e aggiorna questo file a fine fase.

## Contesto (per chi riparte da zero)

- L'editor è TipTap (`src/lib/components/RichTextEditor.svelte`). I blocchi speciali sono blocchi di codice con un linguaggio (`bar-chart`, `mermaid`).
- In lettura `RichContent.svelte` trasforma i blocchi in HTML (`renderBarCharts` in `src/lib/bar-chart.ts`, Mermaid in `src/lib/mermaid.ts`). I valori restano testo, quindi tutto funziona anche senza JavaScript.
- Gli studi visuali esistenti (`ChartStudio.svelte`, `MermaidStudio.svelte`) si aprono da un pulsante della barra o dal menu `/` e riscrivono il blocco; riferimento: `RichTextEditor.svelte` (`openChartStudio`, `insertCodeBlock`).
- Stile YoRHa: token del tema (`--yr-*`, `--automata*`), nessun colore fisso. Il sito è in italiano.
- Regole: modifica minima, niente dipendenze nuove, `docs/bozze/`, `docs/prototypes/` e `static/images/projects/` non si toccano. Niente commit o push senza richiesta. `npm run check:full` una volta a modifiche chiuse.
- Il grafico `bar-chart` ora è sempre a larghezza piena (fatto).

## Schema comune per ogni blocco

1. **Parser + render** in `src/lib/blocks.ts` (nuovo): valida l'input, restituisce HTML; se non è valido lascia il blocco visibile come codice, come fa `renderBarCharts`.
2. **CSS** in `RichContent.svelte`, con i token del tema, e controllo a larghezza stretta (≈375px).
3. **Studio visuale** `src/lib/components/<Nome>Studio.svelte`, con anteprima dal vivo, sul modello di `ChartStudio`.
4. **Aggancio all'editor**: voce nel menu `/`, pulsante nella barra, doppio clic per modificare (come `bar-chart`).
5. **Test** in `tests/` per parser e casi non validi.

## Fase 0 — Base comune

- [x] `src/lib/blocks.ts`: registro dei blocchi (linguaggio → render) e utilità condivise (escape, decodifica). Testato. Ogni nuovo blocco fa `blockRenderers.set(...)` e il suo modulo va importato in `RichContent.svelte`
- [x] `RichContent.svelte`: richiamare il registro accanto a `renderBarCharts`
- [x] `RichTextEditor.svelte`: generalizzare apertura/inserimento studio per più tipi. Fatto con `openStudio`/`editBlockAt` e il registro `src/lib/editor/studios.ts` (nuovo studio = una voce lì + voce `/` + pulsante). `check` e test verdi. Provato a mano: pulsanti barra, menu `/`, «Modifica» e inserimento dopo un blocco di altro tipo. Nota: `/grafico` apre Mermaid (parola chiave condivisa, già prima del refactor); `/barre` apre il grafico
- [x] Componente `BlockStudio` di base (frame, anteprima, Annulla/Inserisci) in `BlockStudio.svelte` (snippet `controls`/`preview`, `submit`). Verificato con lo studio Terminale e gli altri cinque

## Fase 1 — Blocchi di contenuto

Fatta. Parser, render e comportamento in `src/lib/blocks-content.ts` (un solo modulo, una specifica per blocco), studio unico guidato dai campi in `ContentStudio.svelte` (la voce in `studios.ts` passa `props: { kind }`), CSS in `RichContent.svelte`, aggancio: select «＋ Blocco…» nella barra, voci `/` e «Modifica …». `check`, `lint:code` e `npm test` verdi; provati a mano in anteprima (desktop, ~566px e 375px). Senza JS i blocchi restano leggibili; copia e spunte si attivano via `enhanceBlocks`.

Sintassi (blocco di codice con il linguaggio indicato):
- `terminale`: `titolo: …`, poi righe; `$ comando` o output
- `tldr`: `titolo: …`, poi `- punto` (1–5)
- `accordion`: `aperta: sì|no`, poi `## Titolo` e testo (paragrafi separati da riga vuota)
- `timeline`: `orizzontale: sì|no`, poi `data | titolo | testo`
- `citazione`: `autore:`, `fonte:`, `link:` (solo http/https), poi il testo
- `passi`: una riga per passo, `passo | nota`

- [x] **Terminale** (`terminale`): righe `$` e output, pulsante copia comandi, titolo finestra. Studio: lista righe comando/output, riordino
- [x] **Accordion** (`accordion`): voci titolo + testo, `<details>` nativo, opzione "prima aperta"
- [x] **Timeline** (`timeline`): data, titolo, testo; `orizzontale: sì` scorre di lato su mobile (provato a 375px, nessun overflow di pagina)
- [x] **TL;DR** (`tldr`): titolo + fino a 5 punti
- [x] **Citazione** (`citazione`): testo, autore, fonte, link opzionale
- [x] **Passi** (`passi`): checklist numerata, spunte in `localStorage` con chiave dal contenuto (provato: salva e barra il passo)
- [x] Test in `tests/content.test.mjs` (casi validi e non validi di tutti e sei, giro serialize → parse)

Note: nel tema `figure` è `grid` con `place-items: center` e `figcaption` ha `max-inline-size`: terminale e citazione li azzerano nel CSS. Non provati: tema scuro (se esiste) e il pulsante «Copia comandi» con la clipboard reale.

## Fase 2 — Callout a livelli

- [x] Estendere `.rich-callout`: aggiunto `error` (`CALLOUT_TONES` in `extensions.ts`), icona per livello via `::before` in `RichContent.svelte` (info `i`, warning `!`, error `×` su fondo rosso, tip `★`). Provato a mano a ~416px nel sito; tema scuro non provato
- [x] Livello scelto dal select accanto al pulsante «Box» e dal menu `/` («Box: errore»). Compatibilità: i callout storici (`info`/`warning`/`tip`) restano identici, nessuna riscrittura. Niente campo titolo: il titolo si scrive come primo paragrafo in grassetto. Test del sanitizer per i quattro livelli

## Fase 3 — Grafici e tabelle

- [x] **Torta/anello**: `tipo: torta` e `tipo: anello` in `bar-chart.ts` (`renderPie`): `conic-gradient` + legenda con valore e percentuale (testo sempre presente, anche senza CSS). Colori per fetta: `| colore` della riga, altrimenti ciclo dei token YoRHa; somma 0 → resta codice. `ChartStudio` ha le due voci nel select (spessore e larghezza nascosti per questi tipi). Provato a ~566px; i test coprono render e caso non valido
- [x] **Tabella con evidenziazione**: attributo `data-hl="+,-,0"` sulla tabella (una voce per colonna: più alto / più basso è meglio / ignora). Logica in `src/lib/table-highlight.ts` (lato client, richiamata da `RichContent`): per ogni colonna numerica migliore in accento e peggiore in rosso, con simbolo ▲/▼ oltre al colore. `data-hl` ammesso dal sanitizer; l'estensione `HighlightTable` (`extensions.ts`) lo salva come attributo `highlight`
  - [x] Attivazione: attributo sulla tabella, scritto dallo studio
  - [x] Esclusione e verso per colonna: nel valore di `data-hl`
  - [x] Studio tabella: `TableStudio.svelte` (su `BlockStudio`), pulsante «Evidenzia…» nella barra tabella, con anteprima dal vivo
  - [x] Verifica: `1.234,5`, `1.234`, `12,5 %`, `120 ms`, `€ 1.200`, celle vuote e colonne di testo (test su `parseCellNumber`; provato a mano nell'editor: colonna testo saltata, cella vuota ignorata)

Note: l'evidenziazione si vede solo in lettura/anteprima (non dentro l'editor) e richiede JS; senza JS la tabella resta normale. Non provati: tema scuro, 375px per la tabella evidenziata, apertura di «Modifica grafico» su una torta già salvata.

## Fase 4 — Lettura

Fatta. Indice in `TocRail.svelte` (agganciato a `pagine/[slug]` e `progetti/[slug]`), glossario in `src/lib/glossary.ts` (richiamato da `RichContent`) con studio `TermStudio.svelte`. `check` e `npm test` verdi; provati a mano in anteprima (1800, 1300 e 375px).

- [x] **Indice flottante** `TocRail.svelte`: legge `h2/h3` (solo figli diretti del contenuto), dà un id ai titoli che ne sono privi, evidenzia la sezione corrente. Fisso a sinistra della colonna: in Wide compare da 104rem di finestra, in Narrow da 76rem (la colonna è stretta e lo spazio c'è); sotto, nascosto. Senza JS non c'è
- [x] **Glossario inline**: `[[termine|definizione]]`, termine con sottolineatura punteggiata e tooltip (hover, focus da tastiera, tocco, Esc chiude); sul telefono la definizione sta in basso a tutta larghezza. Studio: pulsante «Definizione» sul testo selezionato e voce `/Definizione`; inserisce `[[…]]` nel testo
- [x] Verificato con `ReadingWidth`: a 1300px il rail è nascosto in Wide e visibile in Narrow senza toccare la colonna (rail a 53–261px, articolo da 293px)

Note: nell'editor il glossario resta visibile come `[[termine|definizione]]` (si vede solo in lettura/anteprima) e per modificarne uno già scritto si cambia il testo a mano. Il tooltip non funziona dentro codice, link o a cavallo di grassetti. Non provati: tema scuro, indice su un progetto (`progetti/[slug]`), articolo con meno di 2 titoli (il rail non compare).

## Fase 5 — Chiusura

- [x] `docs/ARCHITECTURE.md` (sezione «Blocchi dell’editor») e skill `articolo-daniele` (`references/blocchi-cms.md`) con la sintassi di tutti i blocchi — fatto insieme alla fase 4
- [x] Test in `tests/content.test.mjs` per tutti i parser (grafici, torta, sei blocchi, tabella, glossario, registro, sanitizer)
- [x] `npm run check:full` verde (check, test, lint, build, verify-build, 45 e2e passati, 3 saltati)
- [x] Prova a vista: desktop wide, narrow e 375px fatta fase per fase (vedi sopra). Il tema scuro esiste ma non è stato provato sui nuovi blocchi
- [x] Commit e push richiesti ed eseguiti a fine fase 5

## Ordine consigliato

0 → 1 (terminale, TL;DR, accordion per primi: danno più valore) → 3 (torta, tabella) → 2 → 4 → 5. Una fase per sessione, spuntando le voci man mano.
