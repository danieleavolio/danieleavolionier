import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';

const functions = '.vercel/output/functions';
const entries = await readdir(functions, { recursive: true });
const configs = entries
	.filter((name) => name.endsWith('.prerender-config.json'))
	.map((name) => name.replaceAll('\\', '/'));
const pages = ['__root__', 'pagine', 'progetti', 'now', 'pagine/[slug]', 'progetti/[slug]'];
const endpoints = ['sitemap.xml', 'rss.xml', 'search.json', 'api/posts', 'api/progetti'];
// Kit 3 emits data functions only for pages, not unused __data.json routes for endpoints.
for (const route of [...pages, ...pages.map((name) => `${name}/__data.json`), ...endpoints]) {
	assert.ok(
		configs.includes(`${route}.prerender-config.json`),
		`${route}: missing ISR configuration`
	);
}
for (const name of configs) {
	assert.ok(!/admin|media/.test(name), `${name}: private route has ISR`);
	const config = JSON.parse(await readFile(path.join(functions, name), 'utf8'));
	assert.equal(config.expiration, 300, name);
}
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let checkedFiles = 0;
if (serviceKey) {
	const clientDirectory = '.svelte-kit/output/client';
	for (const entry of await readdir(clientDirectory, { recursive: true, withFileTypes: true })) {
		if (!entry.isFile()) continue;
		const filename = path.join(entry.parentPath, entry.name);
		const bytes = await readFile(filename);
		assert.ok(
			!bytes.includes(Buffer.from(serviceKey)),
			`${filename}: private service key in client output`
		);
		checkedFiles++;
	}
}
console.log(`${configs.length} public ISR configurations at 300s; no admin/upload ISR.`);
console.log(
	serviceKey
		? `Private service key absent from ${checkedFiles} client files.`
		: 'Service-key scan skipped: no local service key configured.'
);
