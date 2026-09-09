import fs from 'node:fs';
import path from 'node:path';
import { listPublishedContent, listNowItems } from '$lib/server/content';

const siteURL = 'https://www.danieleavolio.it';

const navHeaderLinks = ['/', '/pagine', '/progetti', '/now', '/data', '/appunti'];

export async function GET({ locals }) {
	const [posts, projects, nowItems] = await Promise.all([
		listPublishedContent(locals.supabase, 'posts'),
		listPublishedContent(locals.supabase, 'projects'),
		listNowItems(locals.supabase)
	]);
	const blogLinks = posts.map((post) => `/pagine/${post.slug}`);
	const projectLinks = projects.map((project) => `/progetti/${project.slug}`);
	const nowLinks = nowItems.length ? ['/now'] : [];

	const staticFileLinks = getStaticFileLinks('static/files', '/files');

	const links = [...navHeaderLinks, ...blogLinks, ...projectLinks, ...nowLinks, ...staticFileLinks];

	const uniqueLinks = [...new Set(links)];
	const now = new Date().toISOString();

	const entries = uniqueLinks
		.map((link) => {
			return `<url><loc>${siteURL}${link}</loc><lastmod>${now}</lastmod></url>`;
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

function getStaticFileLinks(directory: string, routeBase: string): string[] {
	const absPath = path.join(process.cwd(), directory);
	if (!fs.existsSync(absPath)) return [];

	return fs
		.readdirSync(absPath)
		.filter((fileName) => fileName.toLowerCase() !== 'files.json')
		.map((fileName) => `${routeBase}/${encodeURIComponent(fileName)}`);
}
