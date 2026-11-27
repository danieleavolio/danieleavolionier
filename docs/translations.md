# Articoli in inglese

Ogni articolo pubblicato ha una versione inglese su `/en/pagine/<slug>`. La
traduce DeepL nel momento in cui salvi dall'admin, e il sito la mostra solo se
esiste. Se manca, `/en/pagine/<slug>` rimanda all'italiano. L'italiano resta la
fonte: l'inglese non si modifica a mano, si rigenera da lui.

## Cosa fai tu quando scrivi

Quasi niente. Scrivi e pubblica come sempre, poi guarda il messaggio dopo il
salvataggio:

| Messaggio                                      | Che cosa è successo                                             |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `Post salvato. Traduzione inglese aggiornata.` | Tradotto e salvato. Apri `/en/pagine/<slug>` e dai un'occhiata. |
| `... già aggiornata.`                          | L'italiano non è cambiato dall'ultima traduzione.               |
| `... non riuscita`                             | L'articolo è salvato, solo in italiano. Riprova a salvare.      |
| nessuna frase sulla traduzione                 | È una bozza, un progetto, o manca `DEEPL_API_KEY`.              |

Le bozze non vengono mai mandate a DeepL: la traduzione parte solo con
`Pubblicato` attivo. Se rinomini lo slug, la traduzione viene rifatta col nuovo
nome e quella vecchia si cancella. Se elimini l'articolo, sparisce anche
l'inglese.

Qualche abitudine rende la traduzione migliore:

- **Controlla l'inglese dopo la prima pubblicazione.** DeepL è bravo, ma i giochi
  di parole, i modi di dire e l'ironia in italiano di solito non passano. Se una
  frase viene male, riscrivila in italiano in modo più diretto e salva di nuovo.
- **Tieni i termini che non vanno tradotti dentro i backtick.** `npm run dev`,
  nomi di file e funzioni restano com'erano. Un nome proprio scritto in
  chiaro (un gioco, un corso) lo traduce DeepL, se lo riconosce come parola comune.
- **Il testo dentro un'immagine non si traduce.** Se uno screenshot ha scritte
  in italiano, aggiungi una frase che le spieghi nel testo.
- **Grafici.** Si traducono il titolo e le etichette. Restano com'erano l'unità
  (`unità: min`), i numeri e i colori. Scrivi l'unità in modo che si capisca in
  entrambe le lingue (`min`, `%`, `MB`).
- **Glossario.** `[[termine|definizione]]` viene tradotto, sia il termine sia la
  definizione.

## Cosa si traduce e cosa no

| Si traduce                                                           | Resta com'è                                     |
| -------------------------------------------------------------------- | ----------------------------------------------- |
| Titolo, descrizione, paragrafi, titoli, elenchi, tabelle, citazioni  | Blocchi di codice di qualsiasi linguaggio       |
| Testi di TL;DR, accordion, timeline, citazione e passi               | Mermaid e righe del terminale                   |
| Titolo ed etichette dei grafici, titolo della finestra del terminale | Codice inline, URL, immagini, video, iframe     |
| Termine e definizione del glossario                                  | Date della timeline, valori e unità dei grafici |

Fuori dagli articoli niente è tradotto: Progetti, Now, Data, Appunti e CV
restano in italiano anche se il menu è in inglese su `/en/...`. Il pulsante
«Copia comandi» e il «Su» in basso restano in italiano.

## Cosa serve (una volta sola)

1. **Applica la migrazione.** Apri l'SQL Editor di Supabase e incolla
   `supabase/migrations/20261128_translations.sql`. Finché non lo fai il sito
   funziona, ma solo in italiano: il codice ignora la tabella mancante.
2. **Metti la chiave su Vercel.** `DEEPL_API_KEY` in Settings, Environment
   Variables, per Production e Preview, poi un nuovo deploy. In locale è già in
   `.env`, che resta fuori da Git. Non scrivere mai la chiave in un file
   tracciato. Se la chiave finisce con `:fx` il codice usa l'endpoint gratuito.
3. **Traduci gli articoli che c'erano già.** Il salvataggio traduce solo ciò
   che salvi da ora in poi. Per gli altri:

```powershell
npm run translate
```

Senza opzioni è un dry-run: elenca gli articoli, dice quali sono nuovi o da
rifare e quanto testo manderebbe a DeepL. Quando ti torna:

```powershell
npm run translate -- --apply
```

Aggiungi `--slug=<slug>` per un articolo solo, `--force` per ritradurre anche
quelli già aggiornati. Lo script stampa a fine corsa l'uso mensile di DeepL.

## Quota e privacy

Il piano Free di DeepL include 500.000 caratteri al mese. Una traduzione
manda l'HTML dell'articolo; lo script mostra quanto hai consumato, e il conto
ufficiale sta sul tuo account DeepL. Salvare senza cambiare nulla non consuma
niente perché la traduzione si rifà solo se l'italiano cambia. Se la quota
finisce, il salvataggio dice `non riuscita` e l'articolo resta in italiano.

A DeepL va solo ciò che è già pubblico. Controlla comunque le condizioni del
piano Free sul trattamento dei testi prima di usarlo per contenuti che non lo sono.

## Come funziona

| Pezzo                                        | File                                                  |
| -------------------------------------------- | ----------------------------------------------------- |
| Tabella `translations`                       | `supabase/migrations/20261128_translations.sql`       |
| Motore: protezione dei blocchi, DeepL        | `src/lib/server/translate.ts`                         |
| Impronta, salvataggio, cancellazione         | `src/lib/server/translations.ts`                      |
| Aggancio al salvataggio e alla cancellazione | `src/lib/server/admin-content.ts`                     |
| Lettura pubblica e unione con l'italiano     | `src/lib/server/public-content.ts`, `article-page.ts` |
| Testi fissi dell'interfaccia                 | `src/lib/i18n.ts`                                     |
| Rotte                                        | `src/routes/en/`                                      |
| Importazione degli articoli vecchi           | `scripts/translate-posts.mjs`                         |

**Flusso.** `saveContent` salva l'articolo e poi chiama `syncTranslation`. Questa
calcola l'impronta (SHA-256 di titolo, descrizione e HTML) e la confronta con
`source_hash` nella tabella. Se è uguale si ferma. Se è diversa passa a
`translateArticle`, che sostituisce i blocchi `<pre>` e il glossario con
segnaposto, divide l'HTML in blocchi di primo livello, li manda a DeepL con
`tag_handling: html` e `ignore_tags: code`, rimette i blocchi al loro posto e
sanifica il risultato.

**Quando rinuncia.** Prima di salvare il motore controlla che ogni segnaposto torni
una volta sola, che i conteggi di paragrafi, titoli, elenchi, tabelle e
immagini siano gli stessi, che ogni grafico e blocco si parsifichi ancora. Se
anche solo una cosa non torna lancia un errore: `syncTranslation` lo registra
e restituisce `failed`. Meglio nessuna versione inglese che una pagina rotta.
Un errore di traduzione non annulla mai il salvataggio.

**Pagine inglesi.** `/en/pagine` elenca gli articoli tradotti. `/en/pagine/<slug>`
riusa lo stesso componente dell'italiano con `lang: 'en'`, e lo stesso vale per
`TocRail`, `RelatedPosts`, `ShareComponent` e il resto, che leggono la lingua dal
percorso. «Leggi anche» propone solo articoli che hanno l'inglese. Le pagine
dichiarano `hreflang` (italiano, inglese e `x-default`) nell'HTML e nella
sitemap; l'attributo `lang` dell'`<html>` si imposta in `hooks.server.ts`. Il
selettore IT/EN dell'header compare solo dove l'altra lingua esiste.

**Ricerca e feed.** `/en/search.json` e `/en/rss.xml` sono route separate
perché l'ISR di Vercel ignora le query string. La ricerca ricarica l'indice
quando cambi lingua.

**Per aggiungere un testo fisso**, scrivilo in tutte e due le lingue in
`src/lib/i18n.ts`. Per aggiungere una lingua, aggiungila a `Lang`, a
`dictionary`, a `translatedLangs` e passa il suo codice DeepL a
`deeplTranslator` (oggi `EN-GB`).

**Per un nuovo blocco dell'editor**, decidi se ha testo da tradurre. Se sì, aggiungi i
suoi campi a `BLOCK_FIELDS` in `translate.ts` e un caso in `tests/content.test.mjs`.
Se no, non fare niente: un blocco sconosciuto resta com'è.
