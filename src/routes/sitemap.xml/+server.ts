import fs from 'node:fs';
import path from 'node:path';
import { listPublishedContent, listNowItems } from '$lib/server/public-content';

const siteURL = 'https://www.danieleavolio.it';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority: string;
}

function formatDateToIso(dateStr?: string | null): string | undefined {
	if (!dateStr) return undefined;
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return undefined;
		return d.toISOString().split('T')[0];
	} catch {
		return undefined;
	}
}

export async function GET({ locals }) {
	const [posts, projects, nowItems] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts').catch(() => []),
		listPublishedContent(locals.supabase, 'projects').catch(() => []),
		listNowItems(locals.supabase).catch(() => [])
	]);

	const urls: SitemapEntry[] = [
		{ loc: `${siteURL}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${siteURL}/pagine`, changefreq: 'daily', priority: '0.9' },
		{ loc: `${siteURL}/progetti`, changefreq: 'daily', priority: '0.9' },
		{ loc: `${siteURL}/appunti`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${siteURL}/data`, changefreq: 'monthly', priority: '0.7' },
		{ loc: `${siteURL}/now`, changefreq: 'weekly', priority: '0.7' },
		{ loc: `${siteURL}/end-of-the-lova`, changefreq: 'monthly', priority: '0.6' },
		{ loc: `${siteURL}/privacy-policy`, changefreq: 'yearly', priority: '0.3' },
		{ loc: `${siteURL}/rss.xml`, changefreq: 'daily', priority: '0.7' }
	];

	// Blog posts
	for (const post of posts) {
		urls.push({
			loc: `${siteURL}/pagine/${post.slug}`,
			lastmod: formatDateToIso(post.date),
			changefreq: 'monthly',
			priority: '0.8'
		});
	}

	// Projects
	for (const project of projects) {
		urls.push({
			loc: `${siteURL}/progetti/${project.slug}`,
			lastmod: formatDateToIso(project.date),
			changefreq: 'monthly',
			priority: '0.8'
		});
	}

	// Static downloads
	const staticFileLinks = getStaticFileLinks('static/files', '/files');
	for (const file of staticFileLinks) {
		urls.push({
			loc: `${siteURL}${file.path}`,
			lastmod: file.lastmod,
			changefreq: 'yearly',
			priority: '0.5'
		});
	}

	// Deduplicate by loc
	const uniqueMap = new Map<string, SitemapEntry>();
	for (const u of urls) {
		if (!uniqueMap.has(u.loc)) {
			uniqueMap.set(u.loc, u);
		}
	}

	const entries = Array.from(uniqueMap.values())
		.map((u) => {
			const lastmodTag = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '';
			return `<url><loc>${u.loc}</loc>${lastmodTag}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
		})
		.join('');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}

function getStaticFileLinks(
	directory: string,
	routeBase: string
): Array<{ path: string; lastmod?: string }> {
	const absPath = path.join(process.cwd(), directory);
	if (!fs.existsSync(absPath)) return [];

	return fs
		.readdirSync(absPath)
		.filter((fileName) => fileName.toLowerCase() !== 'files.json')
		.map((fileName) => {
			const full = path.join(absPath, fileName);
			let lastmod: string | undefined;
			try {
				const stat = fs.statSync(full);
				lastmod = stat.mtime.toISOString().split('T')[0];
			} catch {}
			return {
				path: `${routeBase}/${encodeURIComponent(fileName)}`,
				lastmod
			};
		});
}
