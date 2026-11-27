# Lavorare sul sito

Per avviare il sito segui il [README](README.md). Per individuare i file di una
funzionalità parti da [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Modifiche

- Mantieni i file e i componenti coerenti con il codice vicino. Usa `#lib` per
  gli import interni, TypeScript e i token YoRHa esistenti prima di introdurre
  nuove librerie o nuovi colori. I testi del sito restano in italiano; l'inglese
  degli articoli lo genera [DeepL al salvataggio](docs/translations.md) e i testi fissi
  dell'interfaccia stanno in `src/lib/i18n.ts`.
- Verifica in piccolo. Per l'editor usa una bozza o dati di prova, non scritture
  su Supabase di produzione. Controlla anche l'anteprima quando tocchi il
  rendering degli articoli.
- Le cartelle non tracciate `docs/bozze/`, `docs/prototypes/` e
  `static/images/projects/` sono materiale dell'autore. Non modificarle,
  aggiungerle a Git o includerle in verifiche di formato senza richiesta.

## Controlli

| Quando                                             | Comando                          |
| -------------------------------------------------- | -------------------------------- |
| Tipi e test unitari                                | `npm run check:quick`            |
| Solo lint del codice in `src`, `tests` e `scripts` | `npm run lint:code`              |
| Formato dei file che hai cambiato                  | `npx prettier --check <file...>` |
| Prima di pubblicare                                | `npm run check:full`             |

Il controllo completo usa lo stesso npm su Windows e Linux: tipi, unitari, lint
del codice, build Vercel, verifica dell'output e Playwright. Richiede `.env`
configurato e Chromium (`npx playwright install chromium`). Lascia `SITE_URL`
non impostato per testare la build locale. `npm run lint` controlla l'intero
checkout e può segnalare file personali o formattazione preesistente; non usarlo
per riformattare il progetto in blocco.

## Pubblicazione

Il pre-commit controlla i file in staging; il post-commit fa `git push` e può
innescare il deploy. Chiedi conferma prima di fare commit, push o scritture
remote. Tieni `.env`, credenziali, bozze private e skill personali fuori da Git.
