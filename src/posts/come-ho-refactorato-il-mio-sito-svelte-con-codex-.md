---
title: 'Come ho refactorato il mio sito Svelte con Codex '
description: 'Upgrade a Svelte 5/SvelteKit 2, deploy semplificato, SEO reale, fixing degli errori runtime e workflow admin migliorato.'
date: '2026-3-7'
categories: ['svelte', 'sveltekit', 'refactor', 'seo', 'codex']
published: true
---

## Il contesto

Il mio sito personale aveva già una forte identità visuale in stile NieR:Automata, ma sotto il cofano iniziava a sentire il peso del tempo: dipendenze da aggiornare, deploy non lineare, errori runtime e gestione contenuti fragile.

Obiettivo: fare un refactor vero, senza perdere il design e senza rompere la UX.

## Cosa ho rifatto (davvero)

### 1. Upgrade stack

- migrazione a **Svelte 5** e **SvelteKit 2**
- aggiornamento dipendenze principali
- allineamento a **Node 22**

Questo ha ridotto attriti su build moderna e compatibilità package.

### 2. Deploy più pulito e prevedibile

Uno dei bug più subdoli era avere artefatti `.vercel/output` tracciati in git: risultato, deploy “Ready” ma sito non aggiornato come in locale.

Fix chiave:

- rimozione artefatti build dal tracking
- build sempre dal sorgente
- pipeline coerente commit -> push -> deploy

### 3. SEO reale (non solo meta description)

Ho reso il progetto più indicizzabile con:

- metadati migliorati per pagina
- supporto Open Graph/Twitter
- sitemap/robots più coerenti
- linking interno più solido su home e contenuti

### 4. Stabilità runtime

Durante il refactor sono usciti errori reali lato client/server:

- crash su proprietà `categories` mancanti
- errore su serializzazione in `__data.json` (contenuti non serializzabili)
- mismatch form actions in SvelteKit (`default` + named actions)

Sono stati corretti con hardening su load/action e normalizzazione dei dati.

## Admin: cosa è migliorato e cosa no

Ho migliorato il pannello admin locale con:

- action separate `save` / `remove`
- persistenza login tramite cookie
- creazione e cancellazione post/progetti via UI

Ma c’è un punto architetturale importante:

> In produzione su Vercel, il filesystem è read-only.  
> Quindi scrivere/cancellare file markdown a runtime non è affidabile.

Tradotto: in locale funziona, online va pensata una strategia diversa (DB/CMS/API o workflow git-based).

## UX e transizioni

Ho lavorato sulle transizioni route in stile NieR:

- eliminato effetto “popup” indesiderato
- introdotto un passaggio più glitch/pixel
- mantenuta la responsività e il CSS tema del sito

## Cosa mi porto a casa

Questo refactor non è stato “update e via”. È stato un lavoro su:

- codice
- build/deploy
- SEO
- affidabilità operativa

La differenza vera è questa: ora il progetto è più **manutenibile**, non solo “funzionante”.

## Prossimi step (consigliati)

1. Migrare l’admin produzione su Supabase (o CMS headless) per CRUD reale online.
2. Aggiungere auth seria (niente password hardcoded).
3. Inserire monitoraggio errori (Sentry o equivalente).
4. Aggiungere test smoke sulle route principali prima del deploy.
