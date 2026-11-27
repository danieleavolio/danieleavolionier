import { contentBlockFor, type BlockModel } from '#lib/blocks-content.ts';
import { parseChart } from '#lib/bar-chart.ts';
import { decodeCodeText } from '#lib/blocks.ts';
import { escapeHtmlText } from '#lib/rich-grading.ts';
import { sanitizeContentHtml } from '#lib/server/sanitize.ts';

/**
 * Motore di traduzione IT → EN. Traduce i paragrafi e i testi dei blocchi, e lascia
 * com'è tutto il resto: blocchi di codice, mermaid, terminale, URL, immagini e
 * codice inline. Se qualcosa non torna (segnaposto persi, struttura cambiata) lancia
 * un errore: meglio nessuna traduzione che una pagina rotta.
 */
export type TranslateFn = (texts: string[], format: 'html' | 'text') => Promise<string[]>;
export type Translatable = { title: string; description: string; contentHtml: string };

type Keep = { format: 'html' | 'text'; texts: string[]; build: (translated: string[]) => string };

const GROUP_MAX = 12_000;
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link']);
const STRUCTURE = /<(p|h[1-6]|li|ul|ol|table|tr|td|th|blockquote|img|figure|details|summary)\b/gi;

/** Divide l'HTML in blocchi di primo livello, senza mai spezzare un elemento. */
export function splitTopLevel(html: string): string[] {
	const parts: string[] = [];
	const tag = /<(\/?)([a-z][a-z0-9-]*)\b[^>]*?(\/?)>/gi;
	let depth = 0;
	let start = 0;
	for (let match = tag.exec(html); match; match = tag.exec(html)) {
		const name = match[2].toLowerCase();
		if (VOID_TAGS.has(name) || match[3]) continue;
		if (!match[1]) depth++;
		else {
			depth = Math.max(0, depth - 1);
			if (depth === 0) {
				parts.push(html.slice(start, tag.lastIndex));
				start = tag.lastIndex;
			}
		}
	}
	if (start < html.length) parts.push(html.slice(start));
	return parts.filter((part) => part.trim());
}

const hasWords = (html: string) => /\p{L}/u.test(html.replace(/<[^>]*>/g, ''));
const oneLine = (value: string) => value.replace(/\s*\n\s*/g, ' ').trim();

function structure(html: string): string {
	const counts = new Map<string, number>();
	for (const [, name] of html.matchAll(STRUCTURE)) {
		const key = name.toLowerCase();
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts].sort().join(',');
}

const raw = (value: string): Keep => ({ format: 'text', texts: [], build: () => value });

/** Campi con testo da tradurre per ogni blocco; il resto (date, opzioni, comandi) resta. */
const BLOCK_FIELDS: Record<string, { head: string[]; items: string[] }> = {
	tldr: { head: ['titolo'], items: ['testo'] },
	accordion: { head: [], items: ['titolo', 'testo'] },
	timeline: { head: [], items: ['titolo', 'testo'] },
	citazione: { head: ['testo'], items: [] },
	passi: { head: [], items: ['titolo', 'nota'] },
	terminale: { head: ['titolo'], items: [] }
};
const DEFAULT_TITLES: Record<string, string> = { tldr: 'In short', terminale: 'Terminal' };

function chartKeep(source: string, rewrite: (next: string) => string, original: string): Keep {
	const row = /^(.+?)(\s*\|\s*\d+(?:[.,]\d+)?(?:\s*\|\s*[^|]+)?)$/;
	const lines = source.replace(/\r\n?/g, '\n').split('\n');
	const targets: { line: number; prefix: string; label: string; suffix: string }[] = [];
	lines.forEach((line, index) => {
		const title = line.match(/^(\s*titolo\s*:\s*)(.+)$/i);
		const data = !title && line.match(row);
		if (title) targets.push({ line: index, prefix: title[1], label: title[2], suffix: '' });
		else if (data) targets.push({ line: index, prefix: '', label: data[1], suffix: data[2] });
	});
	return {
		format: 'text',
		texts: targets.map((target) => target.label.trim()),
		build(translated) {
			const next = [...lines];
			targets.forEach((target, index) => {
				const label = oneLine(translated[index] ?? '').replaceAll('|', '/');
				// Il titolo del grafico ha un limite: oltre, il blocco tornerebbe codice.
				const safe = label && (target.prefix === '' || label.length <= 120) ? label : target.label;
				next[target.line] = `${target.prefix}${safe}${target.suffix}`;
			});
			const result = next.join('\n');
			return parseChart(result) ? rewrite(result) : original;
		}
	};
}

function blockKeep(block: string): Keep {
	const code = block.match(/<code\b[^>]*\blanguage-([\w-]+)[^>]*>([\s\S]*?)<\/code>/i);
	if (!code) return raw(block);
	const language = code[1].toLowerCase();
	const inner = code[2];
	const open = code[0].slice(0, code[0].length - inner.length - '</code>'.length);
	const rewrite = (next: string) =>
		block.replace(code[0], () => `${open}${escapeHtmlText(next)}</code>`);
	const source = decodeCodeText(inner.replace(/<[^>]*>/g, ''));

	if (language === 'bar-chart') return chartKeep(source, rewrite, block);

	const spec = contentBlockFor(language);
	const fields = BLOCK_FIELDS[language];
	const model = spec?.parse(source);
	if (!spec || !fields || !model) return raw(block);

	const texts: string[] = [];
	const slots: ((value: string) => void)[] = [];
	const next: BlockModel = {
		head: { ...model.head },
		items: model.items.map((item) => ({ ...item }))
	};
	const take = (record: Record<string, string>, key: string) => {
		const value = record[key]?.trim();
		if (!value) return;
		texts.push(value);
		// I testi su più paragrafi (citazione, accordion) mantengono gli a capo.
		slots.push(
			(translated) =>
				(record[key] = (value.includes('\n') ? translated.trim() : oneLine(translated)) || value)
		);
	};
	for (const key of fields.head) take(next.head, key);
	for (const item of next.items) for (const key of fields.items) take(item, key);
	const fallbackTitle = DEFAULT_TITLES[language];
	return {
		format: 'text',
		texts,
		build(translated) {
			translated.forEach((value, index) => slots[index](value));
			if (fallbackTitle && !model.head.titolo?.trim()) next.head.titolo = fallbackTitle;
			const result = spec.serialize(next);
			return spec.parse(result) ? rewrite(result) : block;
		}
	};
}

function glossaryKeep(term: string, definition: string, original: string): Keep {
	const clean = (value: string) => value.replace(/[[\]|]/g, '').trim();
	return {
		format: 'html',
		texts: [term, definition],
		build: ([t, d]) => (clean(t ?? '') && clean(d ?? '') ? `[[${clean(t)}|${clean(d)}]]` : original)
	};
}

/** Traduce titolo, descrizione e corpo. Lancia se il risultato non è affidabile. */
export async function translateArticle(
	source: Translatable,
	translate: TranslateFn
): Promise<Translatable> {
	const keeps: Keep[] = [];
	const hold = (keep: Keep) => `<x-keep n="${keeps.push(keep) - 1}"></x-keep>`;

	let html = source.contentHtml.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, (block) =>
		hold(blockKeep(block))
	);
	html = html.replace(/\[\[([^[\]|]+)\|([^[\]]+)\]\]/g, (match, term: string, definition: string) =>
		hold(glossaryKeep(term, definition, match))
	);

	const title: Keep = { format: 'text', texts: [source.title], build: ([value]) => value };
	const description: Keep = {
		format: 'text',
		texts: source.description.trim() ? [source.description] : [],
		build: ([value]) => value ?? ''
	};

	// Testi dei blocchi, del glossario, titolo e descrizione: una richiesta per formato.
	const all = [...keeps, title, description];
	const results = all.map((keep) => keep.texts.map(() => ''));
	for (const format of ['text', 'html'] as const) {
		const jobs = all.flatMap((keep, k) =>
			keep.format === format ? keep.texts.map((text, t) => ({ k, t, text })) : []
		);
		if (!jobs.length) continue;
		const out = await translate(
			jobs.map((job) => job.text),
			format
		);
		if (out.length !== jobs.length) throw new Error('Risposta di traduzione incompleta.');
		jobs.forEach((job, index) => (results[job.k][job.t] = out[index]));
	}
	const built = all.map((keep, index) => keep.build(results[index]));

	// Corpo: blocchi di primo livello raggruppati, solo quelli con parole vere.
	const groups: string[] = [];
	for (const part of splitTopLevel(html)) {
		const last = groups.at(-1);
		if (last !== undefined && last.length + part.length <= GROUP_MAX)
			groups[groups.length - 1] += part;
		else groups.push(part);
	}
	const translatable = groups.filter(hasWords);
	const translated = translatable.length ? await translate(translatable, 'html') : [];
	if (translated.length !== translatable.length)
		throw new Error('Risposta di traduzione incompleta.');
	let cursor = 0;
	const body = groups.map((group) => (hasWords(group) ? translated[cursor++] : group)).join('');

	if (structure(body) !== structure(html))
		throw new Error('La struttura è cambiata nella traduzione.');

	const seen = new Map<number, number>();
	const restored = body.replace(
		/<x-keep n="(\d+)"\s*(?:\/>|>\s*<\/x-keep>)/g,
		(_, index: string) => {
			const n = Number(index);
			seen.set(n, (seen.get(n) ?? 0) + 1);
			return built[n] ?? '';
		}
	);
	for (let n = 0; n < keeps.length; n++) {
		if (seen.get(n) !== 1) throw new Error('Un blocco protetto è stato perso nella traduzione.');
	}

	return {
		title: built[keeps.length]?.trim() || source.title,
		description: built[keeps.length + 1]?.trim() || '',
		contentHtml: sanitizeContentHtml(restored)
	};
}

type FetchLike = typeof fetch;

/** Client DeepL: la chiave `:fx` usa l'endpoint del piano Free. */
export function deeplTranslator(
	apiKey: string,
	options: { fetchImpl?: FetchLike; target?: string } = {}
): TranslateFn {
	const doFetch = options.fetchImpl ?? fetch;
	const host = apiKey.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';

	async function request(texts: string[], format: 'html' | 'text'): Promise<string[]> {
		for (let attempt = 0; ; attempt++) {
			const response = await doFetch(`https://${host}/v2/translate`, {
				method: 'POST',
				signal: AbortSignal.timeout(40_000),
				headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: texts,
					source_lang: 'IT',
					target_lang: options.target ?? 'EN-GB',
					preserve_formatting: true,
					...(format === 'html' ? { tag_handling: 'html', ignore_tags: ['code', 'x-keep'] } : {})
				})
			});
			if ((response.status === 429 || response.status === 503) && attempt < 2) {
				await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
				continue;
			}
			if (response.status === 456) throw new Error('Quota DeepL del mese esaurita.');
			if (!response.ok) throw new Error(`DeepL ha risposto ${response.status}.`);
			const data = (await response.json()) as { translations?: { text: string }[] };
			if (data.translations?.length !== texts.length) throw new Error('Risposta DeepL incompleta.');
			return data.translations.map((item) => item.text);
		}
	}

	return async (texts, format) => {
		const out: string[] = [];
		let batch: string[] = [];
		let size = 0;
		const flush = async () => {
			if (batch.length) out.push(...(await request(batch, format)));
			batch = [];
			size = 0;
		};
		for (const text of texts) {
			if (batch.length >= 40 || size + text.length > 60_000) await flush();
			batch.push(text);
			size += text.length;
		}
		await flush();
		return out;
	};
}
