const ALLOWED_TAGS = new Set([
	'a',
	'blockquote',
	'br',
	'code',
	'del',
	'div',
	'em',
	'figcaption',
	'figure',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'iframe',
	'img',
	'li',
	'ol',
	'p',
	'pre',
	's',
	'source',
	'span',
	'strike',
	'strong',
	'sub',
	'sup',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'u',
	'ul',
	'video'
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
	a: new Set(['href', 'target', 'rel']),
	code: new Set(['class']),
	div: new Set(['class', 'data-rich-block', 'data-images', 'data-grade', 'data-max', 'data-title']),
	figcaption: new Set(['class']),
	iframe: new Set([
		'src',
		'title',
		'width',
		'height',
		'allow',
		'allowfullscreen',
		'loading',
		'frameborder'
	]),
	img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
	pre: new Set(['class']),
	source: new Set(['src', 'type']),
	span: new Set(['class']),
	table: new Set(['class']),
	video: new Set(['src', 'controls', 'width', 'height', 'poster', 'preload'])
};

const ALLOWED_IFRAME_HOSTS = [
	'www.youtube.com',
	'youtube.com',
	'open.spotify.com',
	'player.vimeo.com'
];

function isAllowedUrl(val: string): boolean {
	const trimmed = val.trim().toLowerCase();
	if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return true;
	if (
		trimmed.startsWith('https://') ||
		trimmed.startsWith('http://') ||
		trimmed.startsWith('mailto:')
	)
		return true;
	return false;
}

function isAllowedIframeSrc(val: string): boolean {
	try {
		const parsed = new URL(val);
		return ALLOWED_IFRAME_HOSTS.some(
			(host) => parsed.hostname === host || parsed.hostname.endsWith('.' + host)
		);
	} catch {
		return false;
	}
}

export function sanitizeContentHtml(html: string | null | undefined): string {
	if (!html) return '';

	let sanitized = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '')
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style\s*>/gi, '')
		.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object\s*>/gi, '')
		.replace(/<embed\b[^>]*>/gi, '')
		.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form\s*>/gi, '');

	sanitized = sanitized.replace(
		/<(\/?)([a-zA-Z0-9-]+)([^>]*)>/g,
		(_full, closing, tagName, rawAttrs) => {
			const tag = tagName.toLowerCase();
			if (!ALLOWED_TAGS.has(tag)) return '';

			if (closing) {
				return `</${tag}>`;
			}

			const allowedForTag = ALLOWED_ATTRS[tag] ?? new Set();
			const validAttrs: string[] = [];

			if (rawAttrs) {
				const attrRegex = /([a-zA-Z0-9-_:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
				let match;
				while ((match = attrRegex.exec(rawAttrs)) !== null) {
					const attrName = match[1].toLowerCase();
					if (attrName.startsWith('on')) continue;
					if (!allowedForTag.has(attrName)) continue;

					const attrValue = match[2] ?? match[3] ?? match[4] ?? '';

					if (attrName === 'href' || attrName === 'src') {
						if (!isAllowedUrl(attrValue)) continue;
					}

					if (tag === 'iframe' && attrName === 'src') {
						if (!isAllowedIframeSrc(attrValue)) return '';
					}

					const escapedVal = attrValue.replace(/"/g, '&quot;');
					validAttrs.push(`${attrName}="${escapedVal}"`);
				}
			}

			if (tag === 'iframe' && !validAttrs.some((a) => a.startsWith('src='))) {
				return '';
			}

			const attrStr = validAttrs.length > 0 ? ' ' + validAttrs.join(' ') : '';
			const isSelfClosing = ['br', 'hr', 'img', 'source'].includes(tag);
			return `<${tag}${attrStr}${isSelfClosing ? ' />' : '>'}`;
		}
	);

	return sanitized;
}
