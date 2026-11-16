import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:5175';
const canonicalOrigin = 'https://www.danieleavolio.it';
const robotsResponse = await fetch(`${base}/robots.txt`);
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert.match(robots, /Sitemap: https:\/\/www\.danieleavolio\.it\/sitemap\.xml/);
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt blocks the whole site');
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
assert.ok(urls.length > 0, 'Empty sitemap');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
const results = [];
for (let index = 0; index < urls.length; index += 3) {
	results.push(
		...(await Promise.all(
			urls.slice(index, index + 3).map(async (pathname) => {
				const response = await fetch(new URL(pathname, base), { redirect: 'manual' });
				const html = await response.text();
				assert.equal(response.status, 200, pathname);
				const schemas = [
					...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
				];
				assert.ok(schemas.length, `${pathname}: missing JSON-LD`);
				for (const schema of schemas) JSON.parse(schema[1]);
				assert.equal(
					(html.match(/<meta[^>]*name="robots"/g) || []).length,
					1,
					`${pathname}: duplicate robots`
				);
				const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
				assert.equal(
					canonical?.[1],
					`${canonicalOrigin}${pathname === '/' ? '' : pathname}`,
					`${pathname}: incorrect canonical`
				);
				const robotsMeta = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/)?.[1];
				assert.ok(robotsMeta && !/noindex/i.test(robotsMeta), `${pathname}: noindex in sitemap`);
				assert.ok(
					!/noindex/i.test(response.headers.get('x-robots-tag') || ''),
					`${pathname}: noindex header`
				);
				return {
					pathname,
					status: response.status,
					bytes: Buffer.byteLength(html),
					jsonLd: 'valid',
					canonical: canonical[1],
					robots: robotsMeta
				};
			})
		))
	);
}
await mkdir('test-results', { recursive: true });
await writeFile('test-results/seo-verification.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
