# Diagnosi delle esclusioni Search Console

## Cosa sappiamo

La schermata iniziale riportava 17 URL escluse, divise fra due motivi che non
erano visibili. Non è possibile attribuire una causa alle esclusioni senza
vedere quei motivi e gli URL. Un punteggio Lighthouse SEO 100 non dimostra
che Google abbia indicizzato una pagina.

Il controllo tecnico ripetibile è `npm run audit:verify -- https://www.danieleavolio.it`:
verifica sitemap non vuota e senza duplicati, risposte 200 senza redirect,
canonical esatto, assenza di noindex e JSON-LD parsabile per ogni pagina.
Non sostituisce i report Google né convalida l'idoneità ai rich results.

## Dati necessari

In Search Console, proprietà `danieleavolio.it`:

1. Aprire **Indicizzazione → Pagine → Perché le pagine non sono indicizzate**.
2. Per ciascuno dei due motivi, inviare nome completo, data di aggiornamento
   ed esportazione CSV/Excel degli URL (oppure schermate leggibili).
3. Per un URL rappresentativo di ogni gruppo, aprire **Controllo URL** e inviare
   ultima scansione, canonical dichiarato e canonical scelto da Google.

Non servono password, cookie o token di accesso.

## Come decidere gli interventi

| Motivo                                  | Verifica prima di intervenire                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pagina con reindirizzamento             | Normale per HTTP, dominio senza www e vecchi URL diretti al canonical. Non forzare l'indicizzazione del redirect.                                    |
| Esclusa dal tag noindex                 | Corretto per admin e pagina segreta; da correggere se riguarda un contenuto pubblico che si vuole indicizzare.                                       |
| Alternativa con canonical appropriato   | Può essere normale per duplicati e parametri. Controllare la destinazione scelta da Google.                                                          |
| Duplicata, canonical diverso            | Confrontare contenuto, redirect, canonical e link interni sugli URL specifici.                                                                       |
| Scansionata/rilevata ma non indicizzata | Controllare accessibilità e contenuto dell'URL; poi qualità, originalità e collegamenti. Non inventare una correzione tecnica universale.            |
| 404, soft 404 o errore server           | Riprodurre il problema, distinguere contenuti eliminati da pagine che devono esistere, correggere senza trasformare ogni errore in una risposta 200. |

Dopo una correzione pertinente: eseguire il test live dell'URL, richiedere
l'indicizzazione delle pagine interessate e usare **Convalida correzione**
nel gruppo appropriato. La sitemap resta `https://www.danieleavolio.it/sitemap.xml`.
I tempi e l'esito dell'indicizzazione dipendono da Google.
