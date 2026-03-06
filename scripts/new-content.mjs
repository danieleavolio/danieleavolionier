import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2];
const slugArg = process.argv[3];
const titleArg = process.argv[4];

if (!mode || !['post', 'project'].includes(mode)) {
	console.error('Uso: npm run new:post -- <slug> "Titolo" oppure npm run new:project -- <slug> "Titolo"');
	process.exit(1);
}

if (!slugArg) {
	console.error('Devi specificare lo slug. Esempio: npm run new:post -- seo-svelte "SEO con Svelte"');
	process.exit(1);
}

const slug = normalizeSlug(slugArg);
const title = titleArg || slugToTitle(slug);
const now = new Date().toISOString().slice(0, 10);

const isPost = mode === 'post';
const folder = isPost ? 'posts' : 'progetti';
const outputDir = path.join(process.cwd(), 'src', folder);
const outputFile = path.join(outputDir, `${slug}.md`);

if (fs.existsSync(outputFile)) {
	console.error(`File gia esistente: ${outputFile}`);
	process.exit(1);
}

const template = `---
title: ${title}
description: Inserisci una descrizione breve e utile per SEO.
date: "${now}"
categories:
  - ${isPost ? 'blog' : 'project'}
published: false
image: /images/og/${folder}-${slug}.png
---

# ${title}

Scrivi qui il contenuto.
`;

fs.writeFileSync(outputFile, template, 'utf8');
console.log(`Creato: ${outputFile}`);
console.log('Prossimi step:');
console.log(`1) Completa frontmatter e testo in ${folder}/${slug}.md`);
console.log('2) Aggiungi l\'immagine OG in static/images/og/');
console.log('3) Metti published: true quando vuoi pubblicare.');

function normalizeSlug(input) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function slugToTitle(input) {
	return input
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
