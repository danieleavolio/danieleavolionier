# Leggi anche

Il blocco compare dopo il contenuto degli articoli, prima della condivisione e
dell'autore. Non viene aggiunto alle pagine dei progetti.

## UI

`src/lib/components/RelatedPosts.svelte` eredita font e stili globali dei titoli;
non importa font o fogli di stile del prototipo. Usa i token `--automata*`,
`--size-*`, le icone Lucide già presenti e le maiuscole/spaziature dei titoli
del sito. Schede squadrate, sfondo trasparente sulla texture originale, inversione
scura al passaggio e focus da tastiera visibile. La griglia si adatta alla larghezza.

Ogni scheda ha titolo, descrizione e una breve motivazione. Lo score numerico,
il pannello del prototipo e il catalogo completo non vengono inviati al browser.

## Scelta dei suggerimenti

`src/lib/server/related-posts.ts` lavora solo su titolo, descrizione e categorie
pubbliche:

- 45% Jaccard pesato delle categorie: tag rari più importanti; piattaforme e
  `blog` meno importanti. `Svelte`/`SvelteKit` e `coding`/`programmazione` sono
  normalizzati.
- 30% similarità coseno TF-IDF di titolo e descrizione, con titolo pesato
  maggiormente. Nessuna lettura del corpo degli altri articoli.
- 25% temi ricavati da un dizionario editoriale esplicito, non da embedding.
  Per esempio OpenCode e Codex condividono il tema sviluppo assistito da AI.

Pesi iniziali da rivalutare quando cambia il catalogo, non probabilità calibrate.
Soglia minima 0,14, fino a tre risultati, esclusi articolo corrente, bozze e
duplicati. La sola condivisione di piattaforme non basta. A parità di score,
ordinamento stabile per slug. Nessun riempitivo casuale per argomenti isolati.

Non è un sistema personalizzato: nessun tracking, cookie o servizio AI.

## Dati e cache

Il loader del dettaglio aggiunge una query leggera con filtro `published = true`,
usando lo stesso client anonimo delle letture pubbliche. Il browser riceve
soltanto i suggerimenti scelti, con link già presenti nell'HTML senza JavaScript.
Rimane ISR Vercel a 300 secondi: pubblicazioni e cancellazioni possono attendere
la rigenerazione. Se la query secondaria fallisce, l'articolo rimane disponibile
senza il blocco; gli errori della query principale non vengono nascosti.

## Verifiche

```bash
npm run check
npm test
npm run build
node scripts/verify-build.mjs
npm run test:e2e
```

I test coprono vicini sensati, soglia, normalizzazione, stabilità, esclusione
delle bozze, assenza di score/corpi nel payload, fallback della query secondaria,
link senza JavaScript, posizione del blocco, font nativi, focus e navigazione
con aggiornamento di canonical e suggerimenti. Il crawl responsive esistente
controlla tutte le pagine della sitemap a 320, 390 e 768 px.
