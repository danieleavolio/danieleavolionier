import { listContentMetadata, listTranslations } from '#lib/server/public-content.ts';
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
		const [posts, projects, translations] = await Promise.all([
			listContentMetadata(locals.supabase, 'posts'),
			listContentMetadata(locals.supabase, 'projects'),
			// Senza la tabella (migrazione non ancora applicata) il sitemap resta italiano.
			listTranslations(locals.supabase, 'en').catch(() => new Map())
		]);
		// Only canonical, indexable HTML pages. Downloads remain linked from Appunti;
		// the RSS feed and the client-only easter egg are not search landing pages.
		const urls: { loc: string; lastmod?: string; alternates?: { it: string; en: string } }[] = [
			...['/', '/pagine', '/progetti', '/appunti', '/data', '/now', '/cv', '/privacy-policy'].map(
				(route) => ({ loc: `${siteURL}${route}`, lastmod: undefined as string | undefined })
			),
			...posts.flatMap((post) => {
				const it = `${siteURL}/pagine/${encodeURIComponent(post.slug)}`;
				const translation = translations.get(post.slug);
				if (!translation) return [{ loc: it, lastmod: isoDate(post.updatedAt || post.date) }];
				const en = `${siteURL}/en/pagine/${encodeURIComponent(post.slug)}`;
				const alternates = { it, en };
				return [
					{ loc: it, lastmod: isoDate(post.updatedAt || post.date), alternates },
					{
						loc: en,
						lastmod: isoDate(translation.updatedAt || post.updatedAt || post.date),
						alternates
					}
				];
			}),
			...projects.map((project) => ({
				loc: `${siteURL}/progetti/${encodeURIComponent(project.slug)}`,
				lastmod: isoDate(project.updatedAt || project.date)
			}))
		];
		const entries = urls
			.map(({ loc, lastmod, alternates }) => {
				const links = alternates
					? `<xhtml:link rel="alternate" hreflang="it" href="${escapeXml(alternates.it)}"/>` +
						`<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(alternates.en)}"/>` +
						`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(alternates.it)}"/>`
					: '';
				return `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${links}</url>`;
			})
			.join('');
		return new Response(
			`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`,
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
