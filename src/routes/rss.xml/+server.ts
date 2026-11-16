import { listContentMetadata } from '#lib/server/public-content.ts';
import { escapeXml } from '#lib/seo.ts';

const siteURL = 'https://www.danieleavolio.it';
export const config = { isr: { expiration: 300 } };

export async function GET({ locals }) {
	const [posts, projects] = await Promise.all([
		listContentMetadata(locals.supabase, 'posts'),
		listContentMetadata(locals.supabase, 'projects')
	]);

	const allItems = [
		...posts.map((p) => ({
			title: p.title,
			link: `${siteURL}/pagine/${encodeURIComponent(p.slug)}`,
			description: p.description,
			date: p.date,
			category: 'Blog'
		})),
		...projects.map((pr) => ({
			title: pr.title,
			link: `${siteURL}/progetti/${encodeURIComponent(pr.slug)}`,
			description: pr.description,
			date: pr.date,
			category: 'Progetto'
		}))
	];

	allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const itemsXml = allItems
		.map((item) => {
			let pubDateStr: string;
			try {
				pubDateStr = new Date(item.date).toUTCString();
			} catch {
				pubDateStr = new Date().toUTCString();
			}

			return `
		<item>
			<title>${escapeXml(item.title)}</title>
			<link>${item.link}</link>
			<guid isPermaLink="true">${item.link}</guid>
			<description>${escapeXml(item.description)}</description>
			<pubDate>${pubDateStr}</pubDate>
			<category>${escapeXml(item.category)}</category>
		</item>`;
		})
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Daniele Avolio - Data Engineer @ AgileLab</title>
		<link>${siteURL}</link>
		<description>Articoli tecnici su sviluppo software, data engineering, intelligenza artificiale e progetti personali di Daniele Avolio.</description>
		<language>it-IT</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml" />
		${itemsXml}
	</channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
