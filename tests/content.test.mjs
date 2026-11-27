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
let translate;
let article;
let renderBarCharts;
let blocks;
let glossary;
let contentBlocks;
let chartSource;
let chartCodeBlock;
let chartDataSource;
let parseChart;
let tableHighlight;
let sanitizeContentHtml;
let restoreArticleHtml;
let linkGalleryImages;
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
	translate = await server.ssrLoadModule('/src/lib/server/translate.ts');
	article = await server.ssrLoadModule('/src/routes/pagine/[slug]/+page.server.ts');
	({ renderBarCharts, chartSource, chartCodeBlock, chartDataSource, parseChart } =
		await server.ssrLoadModule('/src/lib/bar-chart.ts'));
	tableHighlight = await server.ssrLoadModule('/src/lib/table-highlight.ts');
	blocks = await server.ssrLoadModule('/src/lib/blocks.ts');
	glossary = await server.ssrLoadModule('/src/lib/glossary.ts');
	contentBlocks = await server.ssrLoadModule('/src/lib/blocks-content.ts');
	({ sanitizeContentHtml } = await server.ssrLoadModule('/src/lib/server/sanitize.ts'));
	({ restoreArticleHtml } = await server.ssrLoadModule('/src/lib/server/article-repairs.ts'));
	({ linkGalleryImages } = await server.ssrLoadModule('/src/lib/rich-gallery.ts'));
});
after(async () => {
	await server?.close();
});

test('bar-chart renders readable labels and proportional bars from a Markdown fence', async () => {
	const { marked } = await import('marked');
	const html = marked.parse(
		[
			'```bar-chart',
			'titolo: Deploy & attese',
			'unità: min',
			'Un deploy | 12,5',
			'Due deploy | 25',
			'```'
		].join('\n')
	);
	const rendered = renderBarCharts(html);
	assert.match(rendered, /<figure class="rich-bar-chart yr-panel">/);
	assert.match(rendered, /Deploy &amp; attese/);
	assert.match(rendered, /<strong>12,5 min<\/strong>/);
	assert.match(rendered, /--bar-width:50\.000%/);
	assert.match(rendered, /--bar-width:100\.000%/);
});

test('bar-chart leaves invalid or unrelated code alone and escapes labels and units', () => {
	const invalid = '<pre><code class="language-bar-chart">titolo: Prova\nDato | -1</code></pre>';
	const unrelated = '<pre><code class="language-mermaid">flowchart LR\nA --&gt; B</code></pre>';
	assert.equal(renderBarCharts(invalid + unrelated), invalid + unrelated);
	const safe = renderBarCharts(
		'<pre><code class="language-bar-chart">titolo: &lt;script&gt;\nunita: &lt;b&gt;\n&lt;svg&gt; | 0</code></pre>'
	);
	assert.match(safe, /&lt;script&gt;/);
	assert.match(safe, /&lt;svg&gt;/);
	assert.match(safe, /0 &lt;b&gt;/);
	assert.match(safe, /--bar-width:0\.000%/);
	assert.doesNotMatch(safe, /<(?:script|svg|b)>/);
});

test('il registro dei blocchi rende i linguaggi registrati e lascia il resto come codice', () => {
	const { blockRenderers, renderBlocks, decodeCodeText } = blocks;
	const html = '<pre><code class="language-prova">a &lt; b</code></pre>';
	assert.equal(renderBlocks(html), html);
	blockRenderers.set('prova', (source) => (source === 'a < b' ? '<p>ok</p>' : null));
	try {
		assert.equal(renderBlocks(html), '<p>ok</p>');
		const invalid = '<pre><code class="language-prova">altro</code></pre>';
		assert.equal(renderBlocks(invalid), invalid);
		const other = '<pre><code class="language-js">a</code></pre>';
		assert.equal(renderBlocks(other), other);
	} finally {
		blockRenderers.delete('prova');
	}
	assert.equal(decodeCodeText('&lt;&#65;&#x42;&amp;&unknown;'), '<AB&&unknown;');
});

test('blocchi di contenuto: sorgente valido diventa HTML, non valido resta codice', () => {
	const { contentBlockFor } = contentBlocks;
	const render = (language, source) => blocks.renderBlocks(blocks.blockCodeHtml(language, source));
	const stays = (language, source) =>
		assert.equal(render(language, source), blocks.blockCodeHtml(language, source));

	const term = render('terminale', 'titolo: Shell\n$ npm i\nfatto <ok>\n$ ls');
	assert.match(term, /rich-terminale__bar"><span>Shell<\/span><button[^>]*hidden/);
	assert.equal(term.match(/rich-terminale__cmd/g).length, 2);
	assert.match(term, /fatto &lt;ok&gt;/);
	stays('terminale', '   \n');

	assert.match(render('tldr', 'titolo: Sintesi\n- uno\n- due'), /<li>uno<\/li><li>due<\/li>/);
	stays('tldr', '- 1\n- 2\n- 3\n- 4\n- 5\n- 6');
	stays('tldr', 'testo libero');

	const acc = render('accordion', 'aperta: sì\n## A\nprimo\n\nsecondo\n## B\nx');
	assert.match(acc, /<details open><summary>A<\/summary>.*<p>primo<\/p><p>secondo<\/p>/);
	assert.doesNotMatch(acc.split('<details')[2], /^ open/);
	stays('accordion', 'testo prima del titolo\n## A\nx');

	const time = render('timeline', 'orizzontale: sì\n2024 | Nascita | con | pipe\n2025 | Dopo');
	assert.match(time, /rich-timeline--orizzontale/);
	assert.match(time, /<p>con \| pipe<\/p>/);
	stays('timeline', '2024 senza titolo');

	const quote = render(
		'citazione',
		'autore: Ada\nfonte: Note\nlink: https://example.com/x\nCiao\n\nmondo'
	);
	assert.match(quote, /<a href="https:\/\/example.com\/x"[^>]*>Note<\/a>/);
	assert.match(quote, /<p>Ciao<\/p><p>mondo<\/p>/);
	assert.doesNotMatch(render('citazione', 'fonte: X\nlink: javascript:alert(1)\nt'), /<a /);
	stays('citazione', 'autore: solo autore');

	const steps = render('passi', 'Installa | con npm\nAvvia');
	assert.match(steps, /data-passi="[a-z0-9]+"/);
	assert.equal(steps.match(/type="checkbox"/g).length, 2);
	stays('passi', ' | solo nota');

	// serialize → parse è un giro completo, anche con testi che imitano la sintassi.
	const spec = contentBlockFor('terminale');
	const model = {
		head: { titolo: 'x' },
		items: [
			{ tipo: 'out', testo: '$ finto' },
			{ tipo: 'cmd', testo: 'echo' }
		]
	};
	assert.deepEqual(spec.parse(spec.serialize(model)).items, [
		{ tipo: 'out', testo: ' $ finto' },
		{ tipo: 'cmd', testo: 'echo' }
	]);
});

test('chart studio settings survive CMS sanitation for columns, horizontal bars and lines', () => {
	const settings = {
		title: 'Deploy < & attese',
		unit: 'min',
		thickness: 20,
		color: '#345b78',
		wide: false,
		data: 'Tipo: un deploy | 15\nDue deploy | 30\nTre deploy | 45'
	};
	for (const type of ['colonne', 'barre', 'linea']) {
		const source = chartSource({ ...settings, type });
		const { rows, ...reopened } = parseChart(source);
		assert.deepEqual(reopened, { ...settings, type });
		assert.equal(rows[2].amount, 45);
		assert.equal(rows[2].value, '45');
		const rendered = renderBarCharts(sanitizeContentHtml(chartCodeBlock(source)));
		assert.match(rendered, /Deploy &lt; &amp; attese/);
		assert.match(rendered, /--chart-weight:20%/);
		assert.match(rendered, /--chart-color:#345b78/);
		assert.match(rendered, /<strong>45 min<\/strong>/);
		if (type === 'linea') {
			assert.match(rendered, /points="50,66\.667 150,33\.333 250,0\.000"/);
		} else {
			assert.match(rendered, /--bar-width:33\.333%/);
		}
	}
});

test('each datum can use a YoRHa palette colour or a custom hex colour', () => {
	const data = [
		{ label: 'Primo', value: '15', color: 'rosso' },
		{ label: 'Secondo', value: '30', color: 'bianco' },
		{ label: 'Terzo', value: '45', color: 'giallo' },
		{ label: 'Quarto', value: '10', color: 'nero' },
		{ label: 'Quinto', value: '20', color: '#345b78' }
	];
	const source = chartSource({
		title: 'Colori',
		unit: '',
		type: 'colonne',
		thickness: 60,
		color: '',
		data: chartDataSource(data)
	});
	const parsed = parseChart(source);
	assert.deepEqual(
		parsed.rows.map(({ label, value, color }) => ({ label, value, color })),
		data
	);
	const rendered = renderBarCharts(sanitizeContentHtml(chartCodeBlock(source)));
	assert.match(rendered, /--chart-item-color:var\(--automataRed\)/);
	assert.match(rendered, /--chart-item-color:var\(--automataWhite\)/);
	assert.match(rendered, /--chart-item-color:var\(--automataYellow\)/);
	assert.match(rendered, /--chart-item-color:var\(--automataBlackO\)/);
	assert.match(rendered, /--chart-item-color:#345b78/);
	assert.doesNotMatch(rendered, /--chart-item-color:[^;"]*(?:url|expression|javascript)/i);
});

test('legacy reviews restore grading, galleries and known broken media', async () => {
	const { readFile } = await import('node:fs/promises');
	const source = await readFile(
		new URL('./fixtures/outer-wilds-legacy.txt', import.meta.url),
		'utf8'
	);
	const html = sanitizeContentHtml(restoreArticleHtml(source, { ratingValue: 9 }));
	assert.match(html, /data-rich-block="grading"/);
	assert.match(html, /data-pros="\[&quot;Enigmi ben progettati&quot;/);
	assert.match(html, /Un viaggio indimenticabile/);
	assert.match(html, /data-rich-block="gallery"/);
	assert.doesNotMatch(html, /&lt;Grading/);
	assert.doesNotMatch(html, /thumbs\.gfycat\.com/);
	assert.match(html, /src="https:\/\/i\.imgur\.com\/j47Rjyr\.png"/);
	const linked = linkGalleryImages(html);
	assert.equal([...linked.matchAll(/<a href=/g)].length, 5);
	assert.match(linked, /<a href="https:\/\/i\.imgur\.com\/3MWKU42\.png"><img/);
	assert.doesNotMatch(linked, /<a href=""><img/);
});

test('chart studio options reject injected CSS and out-of-range thickness', () => {
	for (const option of [
		'colore: #345b78;display:none',
		'spessore: 101',
		'tipo: sconosciuto',
		'titolo: Prova'
	]) {
		const source = `titolo: Prova\n${option}\nDato | 10 | rosso`;
		const block = chartCodeBlock(source);
		assert.equal(parseChart(source), null);
		assert.equal(renderBarCharts(block), block);
	}
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

test('related posts keep only the newest copy when the same title appears under two slugs', () => {
	const current = relatedFixture.find((post) => post.slug === 'search');
	const filters = relatedFixture.find((post) => post.slug === 'filters');
	const older = { ...filters, slug: 'filters-old', date: '2000-01-01T00:00:00.000Z' };
	const newer = {
		...filters,
		slug: 'filters-new',
		title: `  ${filters.title.toUpperCase()} `,
		date: '2030-01-01T00:00:00.000Z'
	};
	const slugs = related
		.selectRelatedPosts(current, [...relatedFixture, older, newer])
		.map((post) => post.slug);
	assert.ok(slugs.includes('filters-new'));
	assert.ok(!slugs.includes('filters'));
	assert.ok(!slugs.includes('filters-old'));
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
	const postSelects = calls.filter((call) => call.table === 'posts' && call.method === 'select');
	assert.equal(postSelects.length, 2);
	const summaryProjection = postSelects[1].value;
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

test('sanitizer keeps every callout tone, including error', () => {
	for (const tone of ['info', 'warning', 'error', 'tip']) {
		const html = sanitizeContentHtml(
			`<div data-callout="${tone}" class="rich-callout callout-${tone}"><p>x</p></div>`
		);
		assert.match(
			html,
			new RegExp(`<div data-callout="${tone}" class="rich-callout callout-${tone}">`)
		);
	}
});

test('sanitizer keeps tables with spans and note boxes but drops unknown attributes', () => {
	const html = sanitizeContentHtml(
		'<div data-callout="warning" class="rich-callout callout-warning" onclick="x()"><p>Nota</p></div>' +
			'<table><tbody><tr><th colspan="2" style="color:red">A</th></tr><tr><td rowspan="2">1</td></tr></tbody></table>'
	);
	assert.match(html, /<div data-callout="warning" class="rich-callout callout-warning">/);
	assert.match(html, /<th colspan="2">A<\/th>/);
	assert.match(html, /<td rowspan="2">1<\/td>/);
	assert.doesNotMatch(html, /onclick|style=/);
});

test('torta e anello: fette con percentuali e valori testuali', () => {
	for (const type of ['torta', 'anello']) {
		const html = renderBarCharts(
			chartCodeBlock(`titolo: Quote\nunità: %\ntipo: ${type}\nA | 50\nB | 25 | rosso\nC | 25`)
		);
		assert.match(html, new RegExp(`rich-bar-chart--${type}`));
		assert.match(html, /conic-gradient\(/);
		assert.match(html, /50 % · 50,0%/);
		assert.match(html, /25 % · 25,0%/);
		assert.match(html, /--slice-color:var\(--automataRed\)/);
	}
});

test('torta con somma zero resta codice visibile', () => {
	const block = chartCodeBlock('titolo: Vuoto\ntipo: torta\nA | 0\nB | 0');
	assert.equal(renderBarCharts(block), block);
});

test('evidenziazione tabella: numeri italiani, unità e valori non numerici', () => {
	const { parseCellNumber, parseHighlight, serializeHighlight } = tableHighlight;
	assert.equal(parseCellNumber('1.234,5'), 1234.5);
	assert.equal(parseCellNumber('1.234'), 1234);
	assert.equal(parseCellNumber('1.5'), 1.5);
	assert.equal(parseCellNumber('12,5 %'), 12.5);
	assert.equal(parseCellNumber('120 ms'), 120);
	assert.equal(parseCellNumber('€ 1.200'), 1200);
	assert.equal(parseCellNumber('-3,2'), -3.2);
	assert.equal(parseCellNumber(''), null);
	assert.equal(parseCellNumber('n.d.'), null);
	assert.equal(parseCellNumber('Rosso 2'), null);
	assert.equal(parseCellNumber('1,2,3'), null);
	assert.deepEqual(parseHighlight('+,-,0'), ['+', '-', '0']);
	assert.equal(parseHighlight('0,0'), null);
	assert.equal(parseHighlight('+,x'), null);
	assert.equal(serializeHighlight(['0', '0']), null);
	assert.equal(serializeHighlight(['+', '0']), '+,0');
});

test('sanitizer conserva data-hl sulla tabella', () => {
	assert.match(
		sanitizeContentHtml(
			'<table data-hl="+,-" onclick="x()"><tbody><tr><td>1</td></tr></tbody></table>'
		),
		/<table data-hl="\+,-">/
	);
});

test('glossario: [[termine|definizione]] diventa tooltip, escapato', () => {
	const html = glossary.renderGlossary(
		'<p>Un <strong>x</strong> e [[RLS|Row &amp; Level Security]] qui.</p>'
	);
	assert.match(html, /<span class="rich-term" tabindex="0" aria-describedby="(gl-[^"]+)">/);
	assert.match(html, /<span class="rich-term-word">RLS<\/span>/);
	assert.match(html, /role="tooltip"[^>]*>Row &amp; Level Security<\/span>/);
});

test('glossario: codice, link e testo senza barra restano invariati', () => {
	for (const input of [
		'<pre><code>[[a|b]]</code></pre>',
		'<p><code>[[a|b]]</code></p>',
		'<p><a href="/x">[[a|b]]</a></p>',
		'<p>[[senza definizione]] e [[|vuoto]] e [[a|]]</p>',
		'<p>[[a|b [[c|d]]</p>'
	]) {
		assert.equal(
			glossary.renderGlossary(input).includes('rich-term'),
			input.includes('[[c|d]]'),
			input
		);
	}
	assert.equal(glossary.renderGlossary('<p>nessun termine</p>'), '<p>nessun termine</p>');
});

test('glossario: markup valido solo con termine e definizione puliti', () => {
	assert.equal(
		glossary.glossaryMarkup(' RLS ', 'Row  Level\nSecurity'),
		'[[RLS|Row Level Security]]'
	);
	assert.equal(glossary.glossaryMarkup('', 'x'), null);
	assert.equal(glossary.glossaryMarkup('a|b', 'x'), null);
	assert.equal(glossary.glossaryMarkup('a', 'x]]'), null);
});

// ---------- Traduzione ----------

/** Traduttore finto: prefissa i testi e, come DeepL con ignore_tags, lascia stare <code>. */
const fakeTranslate = async (texts, format) =>
	texts.map((text) =>
		format === 'text'
			? `EN ${text}`
			: !text.includes('<')
				? `EN ${text}`
				: text
						.split(/(<code>[\s\S]*?<\/code>|<x-keep[^>]*><\/x-keep>)/)
						.map((part) =>
							part.startsWith('<code>') || part.startsWith('<x-keep')
								? part
								: part.replace(/>([^<]+)</g, (_, t) => `>EN ${t}<`)
						)
						.join('')
	);

const articleHtml = [
	'<h2>Introduzione</h2>',
	'<p>Usa <code>npm run dev</code> per partire.</p>',
	'<ul><li>uno</li><li>due</li></ul>',
	'<pre><code class="language-js">const ciao = "mondo";</code></pre>',
	'<pre><code class="language-mermaid">flowchart LR\nA --&gt; B</code></pre>',
	'<pre><code class="language-bar-chart">titolo: Tempi di build\nunità: min\nPrima | 12\nDopo | 4 | rosso</code></pre>',
	'<pre><code class="language-tldr">titolo: In breve\n- Primo punto\n- Secondo punto</code></pre>'
].join('');
const chartText = (html) => blocks.decodeCodeText(html.match(/language-bar-chart">([^<]*)</)[1]);

test('splitTopLevel non spezza mai un elemento annidato', () => {
	const parts = translate.splitTopLevel('<p>a</p><ul><li><p>x</p></li></ul>testo<hr><p>b</p>');
	assert.deepEqual(parts, ['<p>a</p>', '<ul><li><p>x</p></li></ul>', 'testo<hr><p>b</p>']);
});

test('traduzione: testo tradotto, codice e mermaid intatti, grafici e blocchi ancora validi', async () => {
	const result = await translate.translateArticle(
		{ title: 'Titolo', description: 'Descrizione', contentHtml: articleHtml },
		fakeTranslate
	);
	assert.equal(result.title, 'EN Titolo');
	assert.equal(result.description, 'EN Descrizione');
	assert.match(result.contentHtml, /<h2>EN Introduzione<\/h2>/);
	assert.match(result.contentHtml, /<code>npm run dev<\/code>/);
	assert.match(result.contentHtml, /const ciao = "mondo";/);
	assert.match(result.contentHtml, /flowchart LR\nA --&gt; B/);
	const chart = chartText(result.contentHtml);
	const parsed = parseChart(chart);
	assert.equal(parsed.title, 'EN Tempi di build');
	assert.deepEqual(
		parsed.rows.map((row) => row.label),
		['EN Prima', 'EN Dopo']
	);
	assert.match(chart, /unità: min/);
	assert.match(result.contentHtml, /language-tldr">titolo: EN In breve\n- EN Primo punto/);
});

test('traduzione: se un blocco protetto si perde, non si salva nulla', async () => {
	const lossy = async (texts, format) =>
		format === 'html' ? texts.map((text) => text.replace(/<x-keep[^>]*><\/x-keep>/g, '')) : texts;
	await assert.rejects(
		translate.translateArticle(
			{ title: 'T', description: '', contentHtml: '<p>Testo</p><p>Vedi [[API|Interfaccia]]</p>' },
			lossy
		),
		/protetto/
	);
});

test('traduzione: un grafico con titolo troppo lungo resta in italiano', async () => {
	const tooLong = async (texts, format) =>
		texts.map((text) => (format === 'text' ? 'x'.repeat(200) : text));
	const html = '<pre><code class="language-bar-chart">titolo: Breve\nA | 1\nB | 2</code></pre>';
	const result = await translate.translateArticle(
		{ title: 'T', description: '', contentHtml: html },
		tooLong
	);
	assert.ok(parseChart(chartText(result.contentHtml)));
	assert.match(chartText(result.contentHtml), /titolo: Breve/);
});

test('traduzione: glossario tradotto, termine e definizione senza separatori', async () => {
	const result = await translate.translateArticle(
		{
			title: 'T',
			description: '',
			contentHtml: '<p>Un [[API|Interfaccia per programmi]] qui.</p>'
		},
		fakeTranslate
	);
	assert.match(result.contentHtml, /\[\[EN API\|EN Interfaccia per programmi\]\]/);
});

test('DeepL: endpoint Free per le chiavi :fx, html con ignore_tags e batch', async () => {
	const calls = [];
	const fetchImpl = async (url, init) => {
		const body = JSON.parse(init.body);
		calls.push({ url, auth: init.headers.Authorization, body });
		return new Response(
			JSON.stringify({ translations: body.text.map((text) => ({ text: `EN ${text}` })) })
		);
	};
	const run = translate.deeplTranslator('chiave:fx', { fetchImpl });
	const out = await run(
		Array.from({ length: 45 }, (_, i) => `<p>${i}</p>`),
		'html'
	);
	assert.equal(out.length, 45);
	assert.equal(calls.length, 2);
	assert.equal(calls[0].url, 'https://api-free.deepl.com/v2/translate');
	assert.equal(calls[0].auth, 'DeepL-Auth-Key chiave:fx');
	assert.equal(calls[0].body.source_lang, 'IT');
	assert.equal(calls[0].body.target_lang, 'EN-GB');
	assert.equal(calls[0].body.tag_handling, 'html');
	assert.deepEqual(calls[0].body.ignore_tags, ['code', 'x-keep']);
	await translate.deeplTranslator('pro-key', { fetchImpl })(['ciao'], 'text');
	assert.equal(calls[2].url, 'https://api.deepl.com/v2/translate');
	assert.equal(calls[2].body.tag_handling, undefined);
});

test('DeepL: quota esaurita dà un errore leggibile e senza la chiave', async () => {
	const fetchImpl = async () => new Response('{}', { status: 456 });
	await assert.rejects(
		translate.deeplTranslator('segreta:fx', { fetchImpl })(['ciao'], 'text'),
		(error) => /Quota DeepL/.test(error.message) && !error.message.includes('segreta')
	);
});

test('related posts: i motivi sono in inglese per la versione inglese', () => {
	const current = relatedFixture.find((post) => post.slug === 'search');
	const selected = related.selectRelatedPosts(current, relatedFixture, 'en');
	assert.ok(selected.length > 0);
	assert.ok(
		selected.every((post) => !/In comune|Stesso tema|Titolo e descrizione/.test(post.reason))
	);
});
