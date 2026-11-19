import { createHash } from 'node:crypto';
import type { Locale } from '#lib/i18n.ts';
import type { Element } from '#lib/types.ts';

const memory = new Map<string, string>();
const ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
const MAX_CHARS = 480;

function key(text: string, html: boolean) {
	return createHash('sha256')
		.update(`${html ? 'html' : 'text'}|${text}`)
		.digest('hex');
}

function splitChunks(text: string): string[] {
	if (text.length <= MAX_CHARS) return [text];
	const parts = text.split(/(?<=[.!?])\s+/);
	const chunks: string[] = [];
	let current = '';
	for (const part of parts) {
		if (current.length + part.length + 1 > MAX_CHARS && current) {
			chunks.push(current);
			current = part;
		} else {
			current = current ? `${current} ${part}` : part;
		}
	}
	if (current) chunks.push(current);
	return chunks;
}

async function request(chunk: string): Promise<string> {
	const url = new URL(ENDPOINT);
	url.searchParams.set('client', 'gtx');
	url.searchParams.set('sl', 'it');
	url.searchParams.set('tl', 'en');
	url.searchParams.set('dt', 't');
	url.searchParams.set('q', chunk);

	const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
	if (!response.ok) throw new Error(`translation failed: ${response.status}`);
	const data = (await response.json()) as Array<Array<[string, string]>>;
	return (data[0] ?? []).map((pair) => pair[0] ?? '').join('');
}

async function translateChunk(text: string, html: boolean): Promise<string> {
	const cacheKey = key(text, html);
	const cached = memory.get(cacheKey);
	if (cached !== undefined) return cached;

	if (!text.trim()) return text;
	try {
		const chunks = splitChunks(text);
		const results: string[] = [];
		for (let index = 0; index < chunks.length; index += 3) {
			const batch = await Promise.all(chunks.slice(index, index + 3).map(request));
			results.push(...batch);
		}
		const translated = results.join(' ').trim();
		memory.set(cacheKey, translated);
		return translated;
	} catch {
		return text;
	}
}

async function translateHtml(html: string): Promise<string> {
	const tokens = html.split(/(<[^>]*>)/);
	const translated = await Promise.all(
		tokens.map((token) =>
			token.startsWith('<') || !token.trim() ? token : translateChunk(token, true)
		)
	);
	return translated.join('');
}

/** Translate display strings, caching every result for the lifetime of the server. */
export async function translateMany(
	texts: string[],
	locale: Locale,
	html = false
): Promise<string[]> {
	if (locale !== 'en' || texts.length === 0) return texts;
	if (html) return Promise.all(texts.map((text) => translateHtml(text)));
	return Promise.all(texts.map((text) => translateChunk(text, false)));
}

/** Translate the display fields of content items, keeping slugs and dates intact. */
export async function translateElements(elements: Element[], locale: Locale): Promise<Element[]> {
	if (locale !== 'en') return elements;
	const texts = elements.flatMap((element) => [
		element.title,
		element.description,
		...element.categories
	]);
	const translated = await translateMany(texts, locale);
	let index = 0;
	return elements.map((element) => ({
		...element,
		title: translated[index++] ?? element.title,
		description: translated[index++] ?? element.description,
		categories: element.categories.map(() => translated[index++] ?? '')
	}));
}
