import { error } from '@sveltejs/kit';

const posts = import.meta.glob('/src/posts/*.md', { eager: true });
const projects = import.meta.glob('/src/progetti/*.md', { eager: true });

export const prerender = false;

export function GET({ params }) {
	const section = params.section;
	const slug = params.slug;

	if (!['pagine', 'progetti'].includes(section) || !/^[a-zA-Z0-9-]+$/.test(slug)) {
		throw error(404, 'Not found');
	}

	const source = section === 'pagine' ? posts : projects;
	const match = Object.entries(source).find(([filePath]) => filePath.endsWith(`/${slug}.md`));

	if (!match) {
		throw error(404, 'Not found');
	}

	const module = match[1] as { metadata?: { title?: string; description?: string } };
	const title = module.metadata?.title || slug.replace(/-/g, ' ');
	const description = module.metadata?.description || 'Daniele Avolio';

	const svg = createOgSvg(title, description, section);

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=86400'
		}
	});
}

function createOgSvg(title: string, description: string, section: string) {
	const safeTitle = escapeXml(title);
	const safeDescription = escapeXml(description);
	const safeSection = escapeXml(section.toUpperCase());

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${safeTitle}">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#c8c2aa" />
			<stop offset="100%" stop-color="#e1d8aa" />
		</linearGradient>
	</defs>
	<rect width="1200" height="630" fill="url(#bg)" />
	<rect x="40" y="40" width="1120" height="550" fill="none" stroke="#4d493e" stroke-width="3" />
	<text x="80" y="130" fill="#4d493e" font-size="34" font-family="Manrope, Arial, sans-serif" letter-spacing="3">${safeSection}</text>
	<foreignObject x="80" y="170" width="1040" height="250">
		<div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'PT Serif', Georgia, serif; font-size:56px; line-height:1.1; color:#3d3b34; font-weight:700;">
			${safeTitle}
		</div>
	</foreignObject>
	<foreignObject x="80" y="450" width="1040" height="120">
		<div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Manrope, Arial, sans-serif; font-size:28px; color:#4d493e; line-height:1.3;">
			${safeDescription}
		</div>
	</foreignObject>
	<text x="80" y="585" fill="#4d493e" font-size="24" font-family="Manrope, Arial, sans-serif">danieleavolio.it</text>
</svg>`;
}

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}
