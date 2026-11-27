# Lavorare su questo sito

- Leggi solo il file che serve: [flusso e controlli](CONTRIBUTING.md), [mappa del codice](docs/ARCHITECTURE.md), [ripartenza](docs/HANDOFF.md). Per qualsiasi testo destinato al sito o alla documentazione usa le skill locali `voce-daniele` (voce e formato) e poi `humanizer` (rilettura contro le formule da AI). Stanno in `~/.config/opencode/skills/` e non sono nel repository pubblico.
- Per richieste chiare, procedi senza domande. Chiedi solo se una scelta cambia il risultato o il perimetro.
- Parti dai file pertinenti: cerca il simbolo e leggi solo il tratto utile. Riusa il contesto e i risultati già ottenuti. Non fare inventari, ricerche web, deleghe o prototipi per abitudine.
- Fai la modifica minima coerente con il codice esistente. Niente refactor, dipendenze o file extra se non servono. Mantieni il sito in italiano e conserva lo stile YoRHa.
- Durante il lavoro verifica il comportamento toccato. Prima di pubblicare esegui `npm run check:full` una volta, a modifiche chiuse. Se fallisce solo un controllo, ripeti quello dopo la correzione. Riassumi gli output lunghi.
- Usa un piano visibile solo quando richiesto o utile per un lavoro a più fasi. Aggiorna l’utente solo su scelte, scoperte o blocchi. Nel finale: esito, verifica concreta e stato della pubblicazione.
- Gli articoli pubblici leggono da Supabase: modificare il Markdown locale non aggiorna la produzione. Evita migrazioni globali per modifiche puntuali. Il post-commit può fare push e pubblicare: niente commit, push o scritture remote senza richiesta.
- Per confronti numerici negli articoli usa un blocco Markdown `bar-chart`, per i diagrammi un blocco ```mermaid. Sintassi e opzioni stanno nella skill `articolo-daniele` (`references/blocchi-cms.md`); il rendering è descritto in `docs/ARCHITECTURE.md` (`renderMermaidSource` in `src/lib/mermaid.ts`).
- Gli articoli hanno una versione inglese generata da DeepL al salvataggio (`docs/translations.md`). I testi fissi vanno in `src/lib/i18n.ts`, in italiano e inglese. Non scrivere l'inglese a mano, non tradurre dal codice a ogni visita e non mettere `DEEPL_API_KEY` in file tracciati.
- Non toccare il lavoro utente fuori perimetro, in particolare `docs/bozze/`, `docs/prototypes/` e `static/images/projects/`.
- Le correzioni a contenuti storici (URL di immagini morte, vecchi blocchi galleria e grading) vanno in `src/lib/server/article-repairs.ts` e si applicano in lettura. Non riscrivere le righe su Supabase per questo.
- Script e route di prova non vanno lasciati in radice o in `src/routes/`: una route lì viene pubblicata. Usa `tests/` o una cartella esclusa da Git.
