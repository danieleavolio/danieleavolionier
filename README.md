# danieleavolionier

Sito personale basato su SvelteKit.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run check
npm run build
npm run preview
```

## Nuovi contenuti

Crea bozza post:

```bash
npm run new:post -- nome-slug "Titolo del post"
```

Crea bozza progetto:

```bash
npm run new:project -- nome-slug "Titolo del progetto"
```

Il comando genera un file markdown in `src/posts` o `src/progetti` con frontmatter standard.

## Deploy

Gli hook Husky sono configurati per:

- `pre-commit`: esecuzione `lint-staged`
- `post-commit`: `git push` automatico

Questo consente il deploy su push senza usare script manuali.
