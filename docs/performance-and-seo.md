# Performance e SEO — 16 novembre 2026

## Vincoli e modifiche

L'identità NieR resta invariata: palette, texture, decorazioni, layout dei contenuti
e famiglie dei font. Il glitch passa a 140 ms senza il fade di uscita che tratteneva
il contenuto precedente; rispetta anche `prefers-reduced-motion`.

- Home: tre anteprime per tabella direttamente nella query, senza i corpi completi.
- Blog: tempi di lettura calcolati sul server, senza trasferire HTML/editor JSON negli elenchi.
- Articoli e progetti: solo campi pubblici, corpo non duplicato, metadati reattivi.
- Ricerca: caricamento su intenzione d'uso, indice leggero, stato di errore con riprova.
- Avatar: WebP responsive 320/640 px; l'originale PNG rimane intatto.
- Material Symbols: stessi cinque glifi, sottoinsieme locale di 3.416 byte con licenza.
- PT Serif e decorazioni: risorse locali; cataloghi Open Props inutilizzati esclusi.
- Mermaid: import e rendering vicino al viewport, ID univoci anche fra più diagrammi.
- Header: link presenti nell'HTML server, una sola ricerca, breakpoint CSS senza sostituzione dopo hydration.
- JSON-LD valido e serializzato in sicurezza, robots non duplicati, date di modifica reali.
- Sitemap: solo pagine HTML indicizzabili; 503 senza cache in caso di database indisponibile, non una sitemap troncata.
- Feed RSS: query leggere, nessuna risposta parziale di successo se fallisce il CMS.
- Immagini OG `.svg`: corretta la gestione dell'estensione che causava 404.

## Cache e confine con l'admin

ISR Vercel di 300 secondi è configurato esplicitamente su home, blog, progetti,
dettagli, Now, ricerca, API pubbliche degli elenchi, sitemap e RSS.
Data, Appunti e Privacy sono generate in build.

Le letture pubbliche usano esclusivamente un client Supabase anonimo senza
cookie o sessione: né le bozze né i dati dell'admin possono entrare nella cache
pubblica. `/admin` e `/api/media` mantengono autenticazione e `private, no-store`.
Anche la richiesta HTML iniziale dell'admin client-rendered viene protetta.

ISR non è simulato da `vite preview`: dopo la scadenza la rigenerazione è
innescata dalle richieste e può esserci una risposta ancora precedente.
Pubblicazioni, modifiche e rimozioni non hanno invalidazione immediata.

## Risultati verificati localmente

Con i 12 articoli e 9 progetti pubblicati al momento della verifica:

| Misura                               |                    Prima |              Dopo |
| ------------------------------------ | -----------------------: | ----------------: |
| HTML home, non compresso             |                252.984 B |          16.365 B |
| Risposta ricerca, non compressa      |                227.647 B |           4.359 B |
| Avatar                               |              1.947.343 B | 25.956 / 75.290 B |
| JSON-LD nelle pagine che lo emettono |            28 non validi |         28 validi |
| Segnalazioni npm audit               | 28, inclusa una critical |  4: 3 low, 1 high |

Lighthouse sulla home in **preview locale**, profilo mobile simulato:
performance **95**, SEO **100**, FCP **1,3 s**, LCP **2,9 s**, TBT **0 ms**,
CLS **0,001**. È una misura di laboratorio, non CrUX né una garanzia in produzione;
il target LCP di 2,5 s resta da raggiungere/verificare sul deploy con CDN.
Il punteggio SEO Lighthouse non certifica l'indicizzazione Google.

Verificati `npm ci`, build Vercel completa su Windows, `npm run lint`,
`svelte-check` senza errori o warning, 9 test server/unitari e 13 test
browser superati; il test menu mobile è volutamente saltato sul progetto desktop.
Il crawl locale controlla le 28 URL in sitemap: stato 200, JSON-LD parsabile,
canonical presente e un solo meta robots. Ricerca, riprova, menu, navigazione
fra articoli, immagini OG, diagrammi, redirect admin e 404 sono coperti dai test.
Non sono stati eseguiti salvataggi/autenticazioni con un account admin reale.

## Riprodurre le verifiche

```bash
npm ci
npm run lint
npm run check
npm test
npm run build
npm run test:e2e
```

Per crawl e screenshot, avvia in un altro terminale:

```bash
npm run preview -- --host 127.0.0.1 --port 5175
```

Poi:

```bash
npm run audit:verify -- http://127.0.0.1:5175
npm run audit:capture -- after http://127.0.0.1:5175
npx --yes lighthouse http://127.0.0.1:5175 --output=json --output-path=./test-results/lighthouse-mobile.json --only-categories=performance,seo --chrome-flags="--headless --no-sandbox" --quiet
node scripts/summarize-audit.mjs
```

Screenshot e report sono in `test-results/`, esclusa da Git. Le misure dei
tempi dipendono dal CMS e dalla rete: non confrontare direttamente il TTFB
del server locale con quello della CDN pubblica.

## Limiti e controlli di rilascio

1. **Packaging Vercel:** build completa verificata su Windows dopo `npm ci`.
   La patch versionata per adapter 6.3.5 usa junction su Windows e lascia
   invariati i symlink Linux. L'output include ISR 300 s per HTML e dati
   pubblici, senza ISR per admin/upload. Non servono privilegi aggiuntivi.
2. **Lint:** migrazione a flat config ESLint 10 e typescript-eslint 8;
   `npm run lint` completa sia Prettier sia ESLint senza errori.
3. **Dipendenze:** aggiornamenti compatibili di Svelte, SvelteKit 2, Vite 6,
   adapter, Supabase, Tiptap, Mermaid, parser e sanitizer. `lint-staged` passa
   alla serie 15 per eliminare segnalazioni moderate. Dopo `npm ci` restano
   **4 segnalazioni: 3 low e 1 high**. L'high Kit include gli advisory
   GHSA-3r8g-jcqq-3p5j e GHSA-6cf5-gc4q-fm3x sulle remote functions,
   non usate/abilitate dal sito. L'audit segnala anche redirect enhanced forms,
   cache-control prerender e cookie: il rischio non viene dichiarato eliminato.
   Il fix proposto da npm richiede Kit 3; non è stato usato
   `npm audit fix --force` né imposta una migrazione maggiore non verificata.
4. **Cache reale:** sul deploy di produzione controllare richieste ripetute di
   HTML e `__data.json`, header HIT/STALE, assenza di cookie sulle risposte
   pubbliche e presenza di `no-store` nell'admin. Controllare scadenza e
   rigenerazione con un contenuto di prova, senza assumere aggiornamenti immediati.
5. **Regioni:** verificare in dashboard la regione Supabase e avvicinare le
   funzioni Vercel al database dove opportuno. La regione non è stata cambiata
   senza conoscere quella del database.
6. **Search Console:** esportare le due ragioni delle 17 esclusioni e gli URL
   coinvolti, usare Controllo URL e Rich Results Test, quindi validare le
   correzioni dopo il rilascio. Non tutte le esclusioni sono errori, né i dati
   strutturati invalidi spiegano necessariamente tutte le esclusioni.
7. **Mobile:** rimangono overflow orizzontali preesistenti in alcuni contenuti
   lunghi/tabelle. Non è stato introdotto un redesign dei contenuti per eliminarli.

La pagina segreta è rimasta funzionante, ma esclusa dalla sitemap con
`X-Robots-Tag: noindex, nofollow`. Gli URL esistenti non sono stati rinominati.
