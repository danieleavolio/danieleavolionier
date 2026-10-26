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
		return [...raw.matchAll(/[\"']((?:[^\"\\]|\\.)*)[\"']/g)].map((match) => match[1]);
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
		` data-pros="${JSON.stringify(info.pros).replace(/"/g, '&quot;')}"`,
		` data-cons="${JSON.stringify(info.cons).replace(/"/g, '&quot;')}"`,
		'>',
		`<div class="rg-grade"><span>${info.grade}</span></div>`,
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

	const gradeExpression = attr('grade');
	if (gradeExpression == null) return null;
	const resolved = variables[gradeExpression.trim()];
	const value = Number(String(resolved ?? gradeExpression).replace(/[^0-9.]/g, ''));

	return normalizeGradingInfo({
		grade: Number.isFinite(value) ? value : 0,
		max: GRADING_DEFAULT_MAX,
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

	const converted = html.replace(
		/(?:<Grading\b[\s\S]*?(?:\/>|<\/Grading\s*>)|&lt;Grading\b[\s\S]*?(?:\/&gt;|&lt;\/Grading\s*&gt;))/gi,
		(tag) => {
			const info = gradingFromLegacyTag(
				tag.includes('&lt;') ? unescapeHtmlText(tag) : tag,
				variables
			);
			return info ? buildGradingBlockHtml(info) : '';
		}
	);

	return converted;
}
