import { createHash } from 'node:crypto';
import type { Locale } from '#lib/i18n.ts';
import type { Element } from '#lib/types.ts';

const translatorUrl = process.env.TRANSLATOR_URL?.replace(/\/$/, '') || '';
const memory = new Map<string, string>();

function key(text: string, target: string, html: boolean) {
	return createHash('sha256')
		.update(`${target}|${html ? 'html' : 'text'}|${text}`)
		.digest('hex');
}

/** Translate the display fields of content items, keeping slugs and dates intact. */
export async function translateElements(elements: Element[], locale: Locale): Promise<Element[]> {
	if (locale !== 'en' || !translatorUrl) return elements;
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

/** Translate a batch of strings with a local MT service, caching every result. */
export async function translateMany(
	texts: string[],
	locale: Locale,
	html = false
): Promise<string[]> {
	if (locale !== 'en' || !translatorUrl || texts.length === 0) return texts;

	const keys = texts.map((text) => key(text, 'en', html));
	const pending = texts
		.map((text, index) => ({ text, index, key: keys[index] }))
		.filter((entry) => !memory.has(entry.key));

	if (pending.length === 0) return texts.map((_, index) => memory.get(keys[index])!);

	try {
		const response = await fetch(`${translatorUrl}/translate`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				texts: pending.map((entry) => entry.text),
				source: 'it',
				target: 'en',
				html
			}),
			signal: AbortSignal.timeout(30_000)
		});
		if (!response.ok) return texts;
		const data = (await response.json()) as { translations?: string[] };
		const translations = data.translations ?? [];
		pending.forEach((entry, index) => {
			memory.set(entry.key, translations[index] ?? entry.text);
		});
		return texts.map((text, index) => memory.get(keys[index]) ?? text);
	} catch {
		return texts;
	}
}
