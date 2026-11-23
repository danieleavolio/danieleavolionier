/**
 * Grading block rendering shared by the public pages, the admin preview and
 * the Tiptap editor. Replaces the old mdsvex `<Grading … />` Svelte component:
 * stored content carries a plain HTML block that every surface renders the
 * same way, without needing client-side component hydration.
 */

export type GradingInfo = {
	grade: number;
	max: number;
	title: string;
	pros: string[];
	cons: string[];
};

export type GradingRange = 'low' | 'mid' | 'high';

export const GRADING_DEFAULT_MAX = 10;

export function gradingRange(grade: number, max = GRADING_DEFAULT_MAX): GradingRange {
	const score = max > 0 ? (grade / max) * 10 : 0;
	return score <= 4 ? 'low' : score <= 7 ? 'mid' : 'high';
}

export function escapeHtmlText(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function unescapeHtmlText(value: string): string {
	return value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&');
}

export function parseArrayLiteral(raw: string | null | undefined): string[] {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
	} catch {
		return [...raw.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g)].map(
			(match) => match[1] ?? match[2]
		);
	}
}

export function normalizeGradingInfo(input: Partial<GradingInfo>): GradingInfo {
	return {
		grade: Number.isFinite(input.grade) ? Number(input.grade) : 0,
		max:
			Number.isFinite(input.max) && Number(input.max) > 0 ? Number(input.max) : GRADING_DEFAULT_MAX,
		title: input.title ?? '',
		pros: Array.isArray(input.pros) ? input.pros.filter(Boolean) : [],
		cons: Array.isArray(input.cons) ? input.cons.filter(Boolean) : []
	};
}

/**
 * Builds the full grading block as HTML for server-rendered surfaces
 * (public pages and the admin preview preview pipeline).
 */
export function buildGradingBlockHtml(input: Partial<GradingInfo>): string {
	const info = normalizeGradingInfo(input);
	const items = (values: string[]) =>
		values.length
			? `<ul>${values.map((item) => `<li>${escapeHtmlText(item)}</li>`).join('')}</ul>`
			: '';

	return [
		`<div class="rich-grading rg-${gradingRange(info.grade, info.max)}" data-rich-block="grading"`,
		` data-grade="${info.grade}" data-max="${info.max}"`,
		info.title ? ` data-title="${escapeHtmlText(info.title)}"` : '',
		` data-pros="${escapeHtmlText(JSON.stringify(info.pros))}"`,
		` data-cons="${escapeHtmlText(JSON.stringify(info.cons))}"`,
		'>',
		`<div class="rg-grade"><span>${info.grade}</span><span class="rg-max">/${info.max}</span></div>`,
		`<div class="rg-list rg-pros"><h3>Pros</h3>${items(info.pros)}</div>`,
		`<div class="rg-list rg-cons"><h3>Cons</h3>${items(info.cons)}</div>`,
		info.title ? `<h2 class="rg-title">${escapeHtmlText(info.title)}</h2>` : '',
		'</div>'
	].join('');
}

/**
 * Parses one legacy `<Grading … />` tag (variable-grade references resolve
 * through [variables], which callers fill with the row metadata).
 */
export function gradingFromLegacyTag(
	tag: string,
	variables: Record<string, unknown> = {}
): GradingInfo | null {
	const attr = (name: string): string | null =>
		tag.match(new RegExp(`${name}\\s*=\\s*\\{([\\s\\S]*?)\\}`, 'i'))?.[1] ?? null;
	const quote = (name: string): string =>
		tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1] ?? '';

	const gradeExpression = attr('grade')?.trim();
	if (!gradeExpression) return null;
	const resolved = Object.hasOwn(variables, gradeExpression)
		? variables[gradeExpression]
		: gradeExpression;
	const value =
		typeof resolved === 'number' || typeof resolved === 'string'
			? Number(String(resolved).trim().replace(',', '.'))
			: NaN;
	if (!Number.isFinite(value)) return null;

	return normalizeGradingInfo({
		grade: value,
		max: Number(attr('max')) || GRADING_DEFAULT_MAX,
		title: quote('title').replace(/&quot;/g, '"'),
		pros: parseArrayLiteral(attr('pros')),
		cons: parseArrayLiteral(attr('cons'))
	});
}

/**
 * Converts legacy `<Grading … />` tags — raw or entity-escaped as literal
 * text in stored content — into the standard grading block HTML.
 */
export function convertGradingTags(html: string, variables: Record<string, unknown> = {}): string {
	if (!html) return '';

	function render(opening: string): string | null {
		const info = gradingFromLegacyTag(
			opening.startsWith('&lt;') ? unescapeHtmlText(opening) : opening,
			variables
		);
		return info ? buildGradingBlockHtml(info) : null;
	}

	return html
		.replace(
			// The old migration parsed the lone closing `>` as an empty blockquote.
			/<p>\s*(&lt;Grading\b[^<]*)<\/p>\s*<blockquote>\s*<\/blockquote>/gi,
			(block, opening: string) => render(opening) ?? block
		)
		.replace(
			/(<(?:pre|code)\b[^>]*>[\s\S]*?<\/(?:pre|code)>)|(<Grading\b[^>]*?>)(?:([\s\S]*?)<\/Grading\s*>)?|(&lt;Grading\b(?:(?!&gt;)[\s\S])*?&gt;)(?:([\s\S]*?)&lt;\/Grading\s*&gt;)?/gi,
			(block, code, raw, rawBody, escaped, escapedBody) => {
				if (code) return block;
				const opening = raw ?? escaped;
				const body = rawBody ?? escapedBody;
				if (body == null && !/\/(?:>|&gt;)$/.test(opening)) return block;
				const grading = render(opening);
				return grading ? `\n\n${grading}\n\n${body?.trim() ?? ''}` : block;
			}
		);
}
