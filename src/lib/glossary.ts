import { escapeHtmlText } from '#lib/rich-grading.ts';

/**
 * Glossario inline: nel testo `[[termine|definizione]]` diventa il termine
 * sottolineato con la definizione in un tooltip (hover, tastiera, tocco).
 * Il sorgente resta testo semplice, quindi si scrive anche a mano.
 */
const TERM = /\[\[([^[\]|]{1,80})\|([^[\]]{1,400})\]\]/g;
const SKIPPED = new Set(['pre', 'code', 'a', 'button']);

const hash = (value: string) => {
	let h = 5381;
	for (let i = 0; i < value.length; i++) h = ((h << 5) + h + value.charCodeAt(i)) | 0;
	return (h >>> 0).toString(36);
};

/** Sorgente da scrivere nel testo; null se termine o definizione non sono validi. */
export function glossaryMarkup(term: string, definition: string): string | null {
	const t = term.replace(/\s+/g, ' ').trim();
	const d = definition.replace(/\s+/g, ' ').trim();
	if (!t || !d || t.length > 80 || d.length > 400) return null;
	if (/[[\]|]/.test(t) || /[[\]]/.test(d)) return null;
	return `[[${t}|${d}]]`;
}

/** HTML di un termine; `term` e `definition` sono già testo escapato. */
function termHtml(term: string, definition: string, index: number): string {
	const id = `gl-${hash(term + definition)}-${index}`;
	return (
		`<span class="rich-term" tabindex="0" aria-describedby="${id}">` +
		`<span class="rich-term-word">${term}</span>` +
		`<span class="rich-term-tip" role="tooltip" id="${id}">${definition}</span></span>`
	);
}

/** Trasforma i termini nel testo, lasciando intatti codice, link e pulsanti. */
export function renderGlossary(html: string): string {
	if (!html.includes('[[')) return html;
	let skip = 0;
	let index = 0;
	return html
		.split(/(<[^>]*>)/)
		.map((part) => {
			if (part.startsWith('<')) {
				const tag = part.match(/^<(\/?)([a-z][a-z0-9]*)/i);
				if (tag && SKIPPED.has(tag[2].toLowerCase()) && !part.endsWith('/>'))
					skip = Math.max(0, skip + (tag[1] ? -1 : 1));
				return part;
			}
			if (skip) return part;
			return part.replace(TERM, (_match, term: string, definition: string) =>
				termHtml(term.trim(), definition.trim(), index++)
			);
		})
		.join('');
}

/** Anteprima: `escapeHtmlText` per il testo digitato nello studio. */
export const glossaryPreviewHtml = (
	before: string,
	term: string,
	definition: string,
	after: string
) =>
	renderGlossary(
		`<p>${escapeHtmlText(before)}${escapeHtmlText(glossaryMarkup(term, definition) ?? '')}${escapeHtmlText(after)}</p>`
	);

function closeTerms(except?: Element | null) {
	document.querySelectorAll('.rich-term.is-open').forEach((open) => {
		if (open !== except) open.classList.remove('is-open');
	});
}

/** Tocco o clic sul termine apre/chiude la definizione; fuori da un termine le chiude. */
export function handleTermClick(event: MouseEvent) {
	const term = event.target instanceof Element ? event.target.closest('.rich-term') : null;
	closeTerms(term);
	term?.classList.toggle('is-open');
}

/** Esc chiude la definizione aperta e toglie il focus dal termine. */
export function handleTermKey(event: KeyboardEvent) {
	if (event.key !== 'Escape') return;
	closeTerms();
	const active = document.activeElement;
	if (active instanceof HTMLElement && active.classList.contains('rich-term')) active.blur();
}
