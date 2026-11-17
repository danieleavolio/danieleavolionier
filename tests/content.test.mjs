import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';

let server;
let content;
let seo;
let sitemap;
let home;
let hooks;
let related;
let article;
const relatedFixture = JSON.parse(
	await readFile(new URL('./fixtures/related-posts.json', import.meta.url), 'utf8')
);
before(async () => {
	server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
	content = await server.ssrLoadModule('/src/lib/server/public-content.ts');
	seo = await server.ssrLoadModule('/src/lib/seo.ts');
	sitemap = await server.ssrLoadModule('/src/routes/sitemap.xml/+server.ts');
	home = await server.ssrLoadModule('/src/routes/+page.server.ts');
	hooks = await server.ssrLoadModule('/src/hooks.server.ts');
	related = await server.ssrLoadModule('/src/lib/server/related-posts.ts');
	article = await server.ssrLoadModule('/src/routes/pagine/[slug]/+page.server.ts');
});
after(async () => {
	await server?.close();
});

function database(rows, error = null) {
	const calls = [];
	const client = {
		from(table) {
			const chain = {
				returns() {
					return chain;
				},
				select(columns) {
					calls.push({ table, method: 'select', value: columns });
					return chain;
				},
				eq(key, value) {
					calls.push({ table, method: 'eq', key, value });
					return chain;
				},
				order(key, value) {
					calls.push({ table, method: 'order', key, value });
					return chain;
				},
				limit(value) {
					calls.push({ table, method: 'limit', value });
					return chain;
				},
				maybeSingle() {
					return Promise.resolve({ data: rows[0] ?? null, error });
				},
				then(resolve, reject) {
					return Promise.resolve({ data: rows, error }).then(resolve, reject);
				}
			};
			return chain;
		}
	};
	return { client, calls };
}

const row = {
	slug: 'example',
	title: 'Example',
	description: 'Description',
	date: '2026-10-01',
	updated_at: '2026-11-01T12:00:00Z',
	categories: ['svelte'],
	published: true,
	content_html: `<p>${'word '.repeat(450)}</p>`,
	content_json: { private: 'editor state' },
	legacy_content: 'legacy copy',
	metadata: { storageImages: ['internal'], isReview: true }
};

test('home asks for only three summaries per table, never full content', async () => {
	const { client, calls } = database([row]);
	const result = await home.load({ locals: { supabase: client } });
	assert.equal(calls.filter((call) => call.method === 'limit' && call.value === 3).length, 2);
	assert.ok(
		calls
			.filter((call) => call.method === 'select')
			.every((call) => !call.value.includes('content'))
	);
	assert.equal(result.posts[0].contentHtml, undefined);
	assert.equal(result.posts[0].metadata, undefined);
});

test('listing preserves reading time without returning the body/editor documents', async () => {
	const { client, calls } = database([row]);
	const [item] = await content.listPublishedContent(client, 'posts', { readingTime: true });
	assert.equal(item.readingTime, 3);
	assert.equal(item.updatedAt, row.updated_at);
	assert.equal(item.contentHtml, undefined);
	assert.equal(item.contentJson, undefined);
	assert.ok(
		calls.some((call) => call.method === 'eq' && call.key === 'published' && call.value === true)
	);
});

test('detail selects only public fields, with lazy media and preserved review data', async () => {
	const { client, calls } = database([
		{
			...row,
			content_html:
				'<img src="/photo.png" alt="Photo"><iframe src="https://www.youtube.com/embed/test"></iframe><video src="/video.mp4"></video>'
		}
	]);
	const item = await content.getContentBySlug(client, 'posts', 'example');
	assert.match(item.contentHtml, /loading="lazy"/);
	assert.match(item.contentHtml, /decoding="async"/);
	assert.match(item.contentHtml, /preload="metadata"/);
	assert.equal(item.isReview, true);
	assert.equal(item.metadata.storageImages, undefined);
	assert.ok(!calls.find((call) => call.method === 'select').value.includes('content_json'));
	assert.ok(calls.some((call) => call.key === 'published' && call.value === true));
});

test('a missing article stays missing; database failures are not empty successes', async () => {
	assert.equal(await content.getContentBySlug(database([]).client, 'posts', 'missing'), null);
	await assert.rejects(
		content.listPublishedContent(database([], new Error('offline')).client, 'posts'),
		/offline/
	);
});

test('JSON-LD is parseable and cannot terminate its script element', () => {
	const value = { title: '</script><img src=x onerror=alert(1)>', text: '\u2028\u2029' };
	const serialized = seo.serializeJsonLd(value);
	assert.ok(!serialized.includes('<'));
	assert.deepEqual(JSON.parse(serialized), value);
	assert.equal(seo.escapeXml('a&<>"\''), 'a&amp;&lt;&gt;&quot;&apos;');
});

test('sitemap contains only landing pages and uses modification timestamps', async () => {
	const { client } = database([row]);
	const response = await sitemap.GET({ locals: { supabase: client } });
	const xml = await response.text();
	assert.equal(response.status, 200);
	assert.match(xml, /2026-11-01T12:00:00.000Z/);
	assert.ok(!xml.includes('/end-of-the-lova'));
	assert.ok(!xml.includes('/rss.xml'));
	assert.ok(!xml.includes('/admin'));
});

test('sitemap failure returns an uncacheable 503, never a truncated sitemap', async () => {
	const response = await sitemap.GET({
		locals: { supabase: database([], new Error('test: database offline')).client }
	});
	assert.equal(response.status, 503);
	assert.equal(response.headers.get('cache-control'), 'no-store');
	assert.equal(response.headers.get('retry-after'), '60');
});

test('public requests never read session cookies or use authenticated clients', async () => {
	const event = {
		url: new URL('https://www.danieleavolio.it/'),
		locals: {},
		get cookies() {
			throw new Error('Public rendering must not access cookies');
		}
	};
	const response = await hooks.handle({
		event,
		resolve: async (request) => {
			assert.equal(request.locals.user, null);
			assert.equal(request.locals.isAdmin, false);
			assert.equal(await request.locals.getSession(), null);
			return new Response('public');
		}
	});
	assert.equal(await response.text(), 'public');
	assert.equal(response.headers.get('set-cookie'), null);
});

test('the client-rendered admin shell redirects anonymous requests with no-store', async () => {
	const event = {
		url: new URL('https://www.danieleavolio.it/admin'),
		locals: {},
		cookies: { getAll: () => [] },
		setHeaders() {}
	};
	const response = await hooks.handle({
		event,
		resolve: async () => {
			throw new Error('Anonymous admin HTML must never be resolved');
		}
	});
	assert.equal(response.status, 303);
	assert.equal(response.headers.get('location'), '/admin/login');
	assert.equal(response.headers.get('cache-control'), 'private, no-store');
});

test('related posts rank useful neighbours with a hard cap and no self-links, drafts or duplicates', () => {
	const current = relatedFixture.find((post) => post.slug === 'search');
	const draft = { ...current, slug: 'draft', published: false };
	const candidates = [
		...relatedFixture,
		draft,
		relatedFixture.find((post) => post.slug === 'filters')
	];
	const before = JSON.stringify(candidates);
	const selected = related.selectRelatedPosts(current, candidates);
	assert.equal(selected.length, 3);
	assert.equal(new Set(selected.map((post) => post.slug)).size, 3);
	assert.ok(selected.some((post) => post.slug === 'filters'));
	assert.ok(selected.some((post) => post.slug === 'codex'));
	assert.ok(
		selected.every((post) => !['search', 'draft', 'pixel', 'outer-wilds'].includes(post.slug))
	);
	assert.equal(JSON.stringify(candidates), before, 'Ranking must not mutate CMS summaries');
	for (const post of selected)
		assert.deepEqual(Object.keys(post).sort(), ['description', 'reason', 'slug', 'title']);
});

test('explicit themes bridge OpenCode/Codex without recommending generic AI content', () => {
	const current = relatedFixture.find((post) => post.slug === 'opencode');
	const selected = related.selectRelatedPosts(current, relatedFixture);
	assert.deepEqual(
		selected.map((post) => post.slug),
		['codex']
	);
	assert.match(selected[0].reason, /sviluppo assistito da AI/);
});

test('review recommendations prefer shared game topics over technical articles', () => {
	const current = relatedFixture.find((post) => post.slug === 'outer-wilds');
	const selected = related.selectRelatedPosts(current, relatedFixture);
	assert.equal(selected[0].slug, 'chants-of-sennaar');
	assert.ok(selected.some((post) => post.slug === 'nier'));
	assert.ok(selected.every((post) => !['search', 'pixel', 'codex'].includes(post.slug)));
});

test('isolated topics, empty candidates and generic platform-only overlaps do not force results', () => {
	const current = relatedFixture.find((post) => post.slug === 'pixel');
	assert.deepEqual(related.selectRelatedPosts(current, relatedFixture), []);
	assert.deepEqual(related.selectRelatedPosts(current, []), []);
	const generic = {
		slug: 'a',
		title: '',
		description: '',
		categories: ['pc', 'ps4'],
		published: true
	};
	assert.deepEqual(related.selectRelatedPosts(generic, [{ ...generic, slug: 'b' }]), []);
	assert.deepEqual(
		related.selectRelatedPosts({ ...generic, categories: [] }, [
			{ ...generic, slug: 'b', categories: [] }
		]),
		[]
	);
});

test('category aliases are case/accent-insensitive and ties have stable ordering', () => {
	const current = {
		slug: 'source',
		title: '',
		description: '',
		categories: ['SVELTE', 'SvelteKit'],
		published: true
	};
	const candidates = ['z', 'b', 'a'].map((slug) => ({
		slug,
		title: '',
		description: '',
		categories: ['sveltekit'],
		published: true
	}));
	const selected = related.selectRelatedPosts(current, candidates);
	assert.deepEqual(
		selected.map((post) => post.slug),
		['a', 'b', 'z']
	);
	assert.deepEqual(selected, related.selectRelatedPosts(current, [...candidates].reverse()));
	const university = relatedFixture.find((post) => post.slug === 'unical');
	const erasmus = relatedFixture.find((post) => post.slug === 'erasmus');
	assert.deepEqual(
		related.selectRelatedPosts(university, [erasmus]),
		related.selectRelatedPosts({ ...university, categories: ['BLOG', 'UNIVERSITA', 'VITA'] }, [
			erasmus
		])
	);
});

test('article load adds only selected lightweight summaries and preserves ISR', async () => {
	const source = relatedFixture.find((post) => post.slug === 'search');
	const rows = [source, ...relatedFixture.filter((post) => post.slug !== source.slug)].map(
		(post) => ({ ...row, ...post })
	);
	const { client, calls } = database(rows);
	const result = await article.load({
		params: { slug: source.slug },
		locals: { supabase: client }
	});
	assert.equal(result.relatedPosts.length, 3);
	assert.equal(result.contentHtml, row.content_html);
	assert.equal(calls.filter((call) => call.method === 'select').length, 2);
	const summaryProjection = calls.filter((call) => call.method === 'select')[1].value;
	assert.ok(!/content|metadata/.test(summaryProjection));
	assert.equal(
		result.relatedPosts.some((post) => 'contentHtml' in post || 'score' in post),
		false
	);
	assert.equal(article.config.isr.expiration, 300);
});

test('missing articles stay 404 without querying recommendations', async () => {
	const { client, calls } = database([]);
	await assert.rejects(
		article.load({ params: { slug: 'missing' }, locals: { supabase: client } }),
		(error) => error.status === 404
	);
	assert.equal(calls.filter((call) => call.method === 'select').length, 1);
});

test('optional recommendation failures leave the requested article available', async () => {
	const { client } = database([row]);
	const originalFrom = client.from;
	client.from = (table) => {
		const chain = originalFrom(table);
		chain.returns = () =>
			Promise.resolve({ data: null, error: new Error('test: summaries offline') });
		return chain;
	};
	const result = await article.load({ params: { slug: row.slug }, locals: { supabase: client } });
	assert.equal(result.meta.title, row.title);
	assert.equal(result.contentHtml, row.content_html);
	assert.deepEqual(result.relatedPosts, []);
});
