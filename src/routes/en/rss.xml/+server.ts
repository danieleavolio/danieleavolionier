import {
	listContentMetadata,
	listTranslations,
	withTranslations
} from '#lib/server/public-content.ts';
import { escapeXml } from '#lib/seo.ts';

const siteURL = 'https://www.danieleavolio.it';
export const config = { isr: { expiration: 300 } };

export async function GET({ locals }) {
	const [posts, translations] = await Promise.all([
		listContentMetadata(locals.supabase, 'posts'),
		listTranslations(locals.supabase, 'en').catch(() => new Map())
	]);

	const items = withTranslations(posts, translations)
		.map(
			(post) => `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${siteURL}/en/pagine/${encodeURIComponent(post.slug)}</link>
			<guid isPermaLink="true">${siteURL}/en/pagine/${encodeURIComponent(post.slug)}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<category>Blog</category>
		</item>`
		)
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Daniele Avolio - Data Engineer @ AgileLab</title>
		<link>${siteURL}/en/pagine</link>
		<description>Articles on software development, data engineering, artificial intelligence and personal projects by Daniele Avolio, translated from Italian.</description>
		<language>en-GB</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${siteURL}/en/rss.xml" rel="self" type="application/rss+xml" />
		${items}
	</channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
