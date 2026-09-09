import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || (!dryRun && !key)) {
	console.error('Mancano PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env.');
	process.exit(1);
}

const supabase = dryRun ? null : createClient(url, key);

const allowedTags = [
	'a', 'blockquote', 'br', 'code', 'div', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4',
	'h5', 'h6', 'hr', 'iframe', 'img', 'li', 'ol', 'p', 'pre', 'source', 'strong', 'table', 'tbody',
	'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'video'
];

function sanitize(html) {
	return sanitizeHtml(html, {
		allowedTags,
		allowedAttributes: {
			a: ['href', 'target', 'rel'],
			code: ['class'],
			div: ['class', 'data-rich-block', 'data-images', 'data-grade', 'data-max', 'data-title'],
			iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'frameborder'],
			img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
			pre: ['class'],
			source: ['src', 'type'],
			video: ['src', 'controls', 'width', 'height', 'poster', 'preload']
		},
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: false,
		allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'open.spotify.com', 'player.vimeo.com']
	});
}

function galleryImages(source, name) {
	const declaration = source.match(new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm'));
	if (!declaration) return [];
	return [...declaration[1].matchAll(/['"](https?:\/\/[^'"]+)['"]/g)].map((match) => match[1]);
}

function markdownToHtml(source, variables = {}) {
	let prepared = source.replace(/<script[\s\S]*?<\/script>/gi, '');
	prepared = prepared.replace(/<Gallery\s+images=\{([\w-]+)\}\s*\/>/g, (_match, name) => {
		const images = galleryImages(source, name);
		return images.length
			? `<div data-rich-block="gallery" class="rich-gallery" data-images="${images.join('|')}">${images.map((image) => `<img src="${image}" alt="Immagine della galleria" loading="lazy">`).join('')}</div>`
			: '';
	});
	prepared = prepared.replace(/<Grading\b[\s\S]*?\/>/gi, (match) => {
		const expression = match.match(/grade=\{([^}]+)\}/i)?.[1]?.trim() ?? '';
		const title = match.match(/title="([^"]+)"/i)?.[1] ?? '';
		const normalized = String(variables[expression] ?? expression).replace(/[^0-9.]/g, '');
		const titleAttribute = title ? ` data-title="${title.replace(/"/g, '&quot;')}"` : '';
		return `<div data-rich-block="grading" data-grade="${normalized}" data-max="10"${titleAttribute} class="rich-grading">${title ? `<strong>${title}</strong> ` : ''}Valutazione: ${normalized}/10</div>`;
	});
	return sanitize(marked.parse(prepared, { async: false }));
}

function parseValue(value) {
	const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
	return trimmed;
}

function parseFrontmatter(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	const values = {};
	if (!match) return { values, body: source.trim() };

	let currentList = null;
	for (const line of match[1].split(/\r?\n/)) {
		const listItem = line.match(/^\s*-\s*(.*)$/);
		if (listItem && currentList) {
			values[currentList].push(parseValue(listItem[1]));
			continue;
		}
		const field = line.match(/^([\w-]+):\s*(.*)$/);
		if (!field) continue;
		const [, key, raw] = field;
		if (!raw.trim()) {
			values[key] = [];
			currentList = key;
		} else if (raw.trim().startsWith('[')) {
			values[key] = raw.replace(/[\[\]]/g, '').split(',').map(parseValue).filter(Boolean);
			currentList = null;
		} else {
			values[key] = parseValue(raw);
			currentList = null;
		}
	}

	return { values, body: source.slice(match[0].length).trim() };
}

function normalizeDate(value) {
	if (!value) return new Date().toISOString().slice(0, 10);
	const parsed = new Date(value);
	if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
	const parts = String(value).split('-');
	if (parts.length >= 3 && parts[2].length >= 4) return `${parts[2].slice(0, 4)}-${parts[0]}-${parts[1]}`;
	return new Date().toISOString().slice(0, 10);
}

function readEntries(directory, contentType) {
	const absolute = path.join(root, 'src', directory);
	return fs.readdirSync(absolute).filter((file) => file.endsWith('.md')).map((file) => {
		const source = fs.readFileSync(path.join(absolute, file), 'utf8');
		const { values, body } = parseFrontmatter(source);
		const slug = file.replace(/\.md$/, '');
		const metadata = {};
		for (const key of ['isReview', 'gameName', 'gameImage', 'ratingValue', 'reviewBody', 'developer']) {
			if (values[key] !== undefined) metadata[key] = values[key];
		}
		return {
			slug,
			title: values.title || slug,
			description: values.description || '',
			date: normalizeDate(values.date),
			image: values.image || null,
			categories: Array.isArray(values.categories) ? values.categories : [],
			published: values.published !== false,
			content: body,
			content_html: markdownToHtml(body, values),
			content_json: null,
			legacy_content: body,
			metadata: { ...metadata, contentType }
		};
	});
}

async function migrateTable(table, directory) {
	const entries = readEntries(directory, table);
	console.log(`${table}: ${entries.length} elementi${dryRun ? ' (dry-run)' : ''}`);
	if (dryRun) return;
	const { error } = await supabase.from(table).upsert(entries);
	if (error) throw error;
}

await migrateTable('posts', 'posts');
await migrateTable('projects', 'progetti');
console.log('Migrazione completata. I Markdown originali non sono stati modificati.');
