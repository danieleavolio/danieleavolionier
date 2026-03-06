import fs from 'node:fs';
import path from 'node:path';

export const prerender = true;

const siteURL = 'https://www.danieleavolio.it';

const navHeaderLinks = ['/', '/pagine', '/progetti', '/data', '/appunti'];

export async function GET() {
	const links = [
		...navHeaderLinks,
		...getMarkdownLinks('src/posts', '/pagine'),
		...getMarkdownLinks('src/progetti', '/progetti'),
		...getStaticFileLinks('static/files', '/files')
	];

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

function getMarkdownLinks(directory: string, routeBase: string): string[] {
	const absPath = path.join(process.cwd(), directory);
	if (!fs.existsSync(absPath)) return [];

	return fs
		.readdirSync(absPath)
		.filter((fileName) => fileName.endsWith('.md'))
		.map((fileName) => `${routeBase}/${fileName.replace(/\.md$/, '')}`);
}

function getStaticFileLinks(directory: string, routeBase: string): string[] {
	const absPath = path.join(process.cwd(), directory);
	if (!fs.existsSync(absPath)) return [];

	return fs
		.readdirSync(absPath)
		.filter((fileName) => fileName.toLowerCase() !== 'files.json')
		.map((fileName) => `${routeBase}/${encodeURIComponent(fileName)}`);
}
