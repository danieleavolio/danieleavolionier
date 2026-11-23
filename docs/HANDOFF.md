# Ripartenza: editor, grafici e contenuti storici

Le modifiche sono nel working tree, non pubblicate. Parti da `git status --short`
e leggi solo i file che ti servono.

## Cosa c'è di nuovo

- **Studio grafici:** si apre dalla barra dell'editor o con **Modifica grafico**
  sopra un blocco esistente. Ogni dato ha campi separati per etichetta, valore e
  colore. I colori predefiniti sono rosso, bianco, giallo e nero YoRHa; in più ci
  sono un colore personalizzato per dato e un colore base per tutto il grafico.
  Il salvataggio resta un blocco Markdown `bar-chart`, leggibile anche senza
  JavaScript. La sintassi è in [AGENTS.md](../AGENTS.md).
- **Contenuti storici:** `src/lib/server/article-repairs.ts` riscrive in lettura
  i vecchi blocchi galleria e grading delle recensioni e sostituisce gli URL di
  immagini recuperabili. Due sorgenti non esistono più (Gfycat e GameUIDatabase)
  e quei media vengono tolti. Su Supabase non è stato scritto niente.
- **Galleria:** apertura a schermo intero con navigazione (`GalleryLightbox.svelte`).
- **Grading:** mostra voto, titolo, pro e contro.
- **Categorie:** in Articoli e Progetti, **Categorie esistenti** elenca le voci
  della sezione. Un click seleziona o deseleziona, e la voce attiva diventa rossa.
- **Copertina:** si può trascinare o incollare un'immagine nel campo. Usa lo
  stesso caricamento su Supabase Storage delle immagini dell'editor.

## Verifiche fatte il 23 novembre

`npm run check:quick` passa (tipi e 23 test unitari). In Chrome, con dati
fittizi e senza scritture remote, funzionano: modifica di un grafico e colori
per dato (desktop e mobile), galleria, grading, selezione delle categorie,
trascinamento e incolla della copertina. Gli script e la route usati per queste
prove sono in `_to_delete/`, esclusa da Git tramite `.git/info/exclude`.

## Cosa manca

- `npm run check:full` va eseguito prima di pubblicare. Ricorda che il
  post-commit può fare push.
- Corretti anche due problemi che c'erano già prima: le estensioni TipTap
  duplicate (`link`, `underline` disattivate in StarterKit) e il selettore
  `:where(input)::placeholder` in `yorha-ui.css`.
- Resta un chunk JS da circa 1,5 MB (465 kB gzip) da analizzare.
- Dopo il deploy aggiorna o rimuovi questo file.
