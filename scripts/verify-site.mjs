import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:5175';
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const results = [];
for (let index = 0; index < urls.length; index += 3) {
	results.push(
		...(await Promise.all(
			urls.slice(index, index + 3).map(async (pathname) => {
				const response = await fetch(new URL(pathname, base));
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
				assert.ok(html.includes('rel="canonical"'), `${pathname}: missing canonical`);
				return {
					pathname,
					status: response.status,
					bytes: Buffer.byteLength(html),
					jsonLd: 'valid'
				};
			})
		))
	);
}
await mkdir('test-results', { recursive: true });
await writeFile('test-results/seo-verification.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
