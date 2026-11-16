import { listContentMetadata } from '#lib/server/public-content.ts';
import { escapeXml } from '#lib/seo.ts';

const siteURL = 'https://www.danieleavolio.it';
export const config = { isr: { expiration: 300 } };

function isoDate(value?: string): string | undefined {
	if (!value) return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export async function GET({ locals }) {
	try {
		const [posts, projects] = await Promise.all([
			listContentMetadata(locals.supabase, 'posts'),
			listContentMetadata(locals.supabase, 'projects')
		]);
		// Only canonical, indexable HTML pages. Downloads remain linked from Appunti;
		// the RSS feed and the client-only easter egg are not search landing pages.
		const urls = [
			...['/', '/pagine', '/progetti', '/appunti', '/data', '/now', '/privacy-policy'].map(
				(route) => ({ loc: `${siteURL}${route}`, lastmod: undefined as string | undefined })
			),
			...posts.map((post) => ({
				loc: `${siteURL}/pagine/${encodeURIComponent(post.slug)}`,
				lastmod: isoDate(post.updatedAt || post.date)
			})),
			...projects.map((project) => ({
				loc: `${siteURL}/progetti/${encodeURIComponent(project.slug)}`,
				lastmod: isoDate(project.updatedAt || project.date)
			}))
		];
		const entries = urls
			.map(
				({ loc, lastmod }) =>
					`<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
			)
			.join('');
		return new Response(
			`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
			{
				headers: { 'Content-Type': 'application/xml; charset=utf-8' }
			}
		);
	} catch (error) {
		console.error('Sitemap content unavailable:', error);
		// Do not publish/cache a successful-looking sitemap with missing articles.
		return new Response('Sitemap temporaneamente non disponibile', {
			status: 503,
			headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' }
		});
	}
}
