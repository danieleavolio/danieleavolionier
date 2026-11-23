# Ripartenza: Studio Mermaid

Il lavoro della fase 0 (Studio grafici, galleria, grading, categorie, copertina)
è pubblicato nel commit `75c2ab8`. Il piano delle fasi successive è nel progetto
Claude "Sito Web Daniele Avolio", in `claude/piano-editor-e-seo.md`.

## Fase 1, non ancora committata

- **Studio Mermaid:** si apre dalla barra dell'editor oppure con **Modifica
  diagramma** sopra un blocco ```mermaid. Il codice sta a sinistra e l'anteprima
  si aggiorna 300 ms dopo l'ultima modifica. Se il codice non è valido lo Studio
  dice la riga, mostra il messaggio di Mermaid e disattiva il pulsante. Con il
  blocco vuoto propone tre modelli (flusso, sequenza, stati).
- `src/lib/mermaid.ts` espone `renderMermaidSource` e `mountMermaidRender`;
  `renderMermaidBlocks` li usa per gli articoli, con lo stesso comportamento di
  prima (Pele, poi Mermaid.js, niente fallback quando Pele rifiuta per i limiti).
- `codeBlockEditButtons` in `src/lib/editor/extensions.ts` sostituisce
  `chartEditButtons` e gestisce i pulsanti di grafici e diagrammi.

Verificati in Chrome, desktop e mobile, con dati fittizi: modifica di un
diagramma, errore di sintassi, tipo non riconosciuto, inserimento da modello,
annullamento, convivenza con lo Studio grafici e anteprima dell'articolo.
Prima del commit vanno rilanciati gli e2e in locale, perché toccano il rendering
pubblico dei diagrammi.
