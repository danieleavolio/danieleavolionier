import { marked } from 'marked';
import { sanitizeContentHtml } from './sanitize';

/**
 * Markers that only make sense as markdown syntax when they appear inside
 * plain text: at least two of them are required before a document is treated
 * as markdown that reached the database unrendered.
 */
const MARKDOWN_MARKERS = [
	/^#{1,6}\s+\S/m,
	/```/,
	/^\s*[-*+]\s+\S/m,
	/\*\*[^*\n]+\*\*/,
	/\[[^\]]+\]\([^)]+\)/
];

// Only block-level markup means the document was already rendered: inline
// tags such as <a>, <strong> and <em> can coexist with unrendered markdown.
const STRUCTURAL_HTML = /<(h[1-6]|ul|ol|li|pre|code|blockquote|table|img|hr)\b/i;

function toPlainText(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');
}

/**
 * Repairs content saved before the editor converted pasted markdown: such
 * posts hold the whole source in one paragraph with `<br>` breaks, so the
 * markdown renders as literal `##`, `**` and backtick text.
 *
 * Only documents without real structural markup qualify, so regular rich-text
 * posts and posts that legitimately contain code blocks are left untouched.
 */
export function repairPlainMarkdownHtml(html: string | null | undefined): string {
	const source = html ?? '';
	if (!source.trim()) return source;
	if (STRUCTURAL_HTML.test(source)) return source;

	const text = toPlainText(source);
	const markers = MARKDOWN_MARKERS.filter((pattern) => pattern.test(text)).length;
	if (markers < 2) return source;

	const rendered = marked.parse(text, { async: false }) as string;
	return sanitizeContentHtml(rendered);
}
