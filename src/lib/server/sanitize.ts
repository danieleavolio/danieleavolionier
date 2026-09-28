import sanitizeHtml from 'sanitize-html';

const allowedTags = [
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
];

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
	a: ['href', 'target', 'rel'],
	code: ['class'],
	div: ['class', 'data-rich-block', 'data-images', 'data-grade', 'data-max', 'data-title'],
	figcaption: ['class'],
	iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'frameborder'],
	img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
	pre: ['class'],
	source: ['src', 'type'],
	span: ['class'],
	table: ['class'],
	video: ['src', 'controls', 'width', 'height', 'poster', 'preload']
};

export function sanitizeContentHtml(html: string | null | undefined): string {
	return sanitizeHtml(html ?? '', {
		allowedTags,
		allowedAttributes,
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: false,
		allowedIframeHostnames: [
			'www.youtube.com',
			'youtube.com',
			'open.spotify.com',
			'player.vimeo.com'
		]
	});
}
