import { escapeHtmlText } from '#lib/rich-grading.ts';

/**
 * Registro dei blocchi speciali: un blocco di codice con un linguaggio noto
 * diventa HTML in lettura. Se il sorgente non è valido il blocco resta codice.
 * `bar-chart` ha il suo render in `bar-chart.ts`; i nuovi blocchi si registrano qui.
 */
export type BlockRenderer = (source: string) => string | null;

const codeBlock = /<pre\b[^>]*>\s*<code\b([^>]*)>([^<]*)<\/code>\s*<\/pre>/gi;
const namedEntities: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' '
};

export const blockRenderers = new Map<string, BlockRenderer>();

export function decodeCodeText(value: string): string {
	return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, key: string) => {
		if (!key.startsWith('#')) return namedEntities[key.toLowerCase()] ?? entity;
		const hex = key[1].toLowerCase() === 'x';
		const point = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
		return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
	});
}

/** Blocco di codice con il linguaggio dato, come lo produce l'editor. */
export function blockCodeHtml(language: string, source: string): string {
	return `<pre><code class="language-${language}">${escapeHtmlText(source)}</code></pre>`;
}

/** Sostituisce i blocchi registrati e validi; il resto resta com'è. */
export function renderBlocks(html: string): string {
	if (!blockRenderers.size) return html;
	return html.replace(codeBlock, (block, attributes: string, source: string) => {
		// Le entità rendono il sorgente escapato più lungo del testo reale.
		if (source.length > 48_000) return block;
		const classes = attributes.match(/(?:^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
		const language = (classes?.[1] ?? classes?.[2])
			?.split(/\s+/)
			.find((name) => name.startsWith('language-') && blockRenderers.has(name.slice(9)));
		if (!language) return block;
		return blockRenderers.get(language.slice(9))?.(decodeCodeText(source)) ?? block;
	});
}
