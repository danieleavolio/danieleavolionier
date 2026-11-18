import { expect, test } from '@playwright/test';

test('home is compact, crawlable and does not eagerly fetch search or diagram engines', async ({
	page,
	request
}) => {
	const response = await request.get('/');
	const html = await response.text();
	expect(response.status()).toBe(200);
	expect(Buffer.byteLength(html)).toBeLessThan(45_000);
	expect(html).toContain('href="/now"');
	expect(html).not.toContain('contentJson');
	expect(response.headers()['set-cookie']).toBeUndefined();
	const requests: string[] = [];
	const errors: string[] = [];
	page.on('request', (request) => requests.push(request.url()));
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await expect(page.locator('.latest-panel li')).toHaveCount(6);
	await expect(page.locator('main h1')).toHaveCount(1);
	const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
	expect(schemas.length).toBeGreaterThan(0);
	for (const schema of schemas) expect(JSON.parse(schema)['@graph']).toBeTruthy();
	expect(requests.some((url) => url.includes('/search.json'))).toBe(false);
	expect(requests.some((url) => /fonts\.(googleapis|gstatic)\.com/.test(url))).toBe(false);
	expect(errors).toEqual([]);
	const avatar = page.getByRole('button', { name: /Ritratto di Daniele Avolio/ });
	await expect(avatar).toBeVisible();
	await expect(avatar.locator('img')).toHaveAttribute('src', '/images/avatar-640.webp');
});

test('search works on demand, including keyboard and article-to-article navigation', async ({
	page,
	request
}) => {
	const response = await request.get('/search.json');
	const text = await response.text();
	expect(Buffer.byteLength(text)).toBeLessThan(10_000);
	const entries = JSON.parse(text);
	expect(Object.keys(entries.posts[0]).sort()).toEqual(['description', 'slug', 'title']);
	await page.goto('/pagine/opencode-e-le-balene');
	await page.getByRole('button', { name: 'Cerca nel sito' }).click();
	const input = page.getByPlaceholder('Cerca articoli, progetti, appunti');
	await expect(input).toBeVisible();
	await input.fill('Outer Wilds');
	await page.locator('dialog .results li').first().click();
	await expect(page).toHaveURL(/\/pagine\/recensione-outer-wilds$/);
	await expect(page).toHaveTitle(/Recensione Outer Wilds/);
	await expect(page.locator('hgroup h1')).toHaveText('Recensione Outer Wilds');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://www.danieleavolio.it/pagine/recensione-outer-wilds'
	);
	await page.keyboard.press('Control+k');
	await expect(input).toBeVisible();
	await input.fill('NieR');
	await page.locator('dialog .results li').filter({ hasText: 'Recensione NieR:Automata' }).click();
	await expect(page).toHaveURL(/\/pagine\/recensione-nier-automata$/);
	await expect(page).toHaveTitle(/Recensione NieR:Automata/);
	await expect(page.locator('hgroup h1')).toHaveText('Recensione NieR:Automata');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://www.danieleavolio.it/pagine/recensione-nier-automata'
	);
	const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
	expect(schemas).toHaveLength(1);
	const review = JSON.parse(schemas[0])['@graph'].find(
		(item: { '@type': string }) => item['@type'] === 'Review'
	);
	expect(review.itemReviewed.name).toContain('NieR');
	await page.goBack();
	await expect(page).toHaveTitle(/Recensione Outer Wilds/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://www.danieleavolio.it/pagine/recensione-outer-wilds'
	);
});

test('search can retry a transient failure', async ({ page }) => {
	let requests = 0;
	await page.route('**/search.json', async (route) => {
		if (++requests === 1) await route.fulfill({ status: 503, body: 'offline' });
		else await route.continue();
	});
	await page.goto('/');
	await page.getByRole('button', { name: 'Cerca nel sito' }).click();
	await expect(page.getByText('Ricerca temporaneamente non disponibile.')).toBeVisible();
	await page.getByRole('button', { name: 'Riprova' }).click();
	await expect(page.getByPlaceholder('Cerca articoli, progetti, appunti')).toBeVisible();
});

test('diagrams render near the viewport and retain the NieR theme', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/pagine/opencode-e-le-balene');
	await expect(page.locator('.rich-content pre, .rich-mermaid').first()).toBeVisible({
		timeout: 20_000
	});
	await page.evaluate(() => {
		const blocks = Array.from(
			document.querySelectorAll<HTMLElement>('.rich-content pre, .rich-content .rich-mermaid')
		);
		const target = blocks.find((block) => /flowchart|graph\s/i.test(block.textContent ?? ''));
		(target ?? blocks[0])?.scrollIntoView({ block: 'center' });
	});
	const diagram = page.locator('.rich-mermaid').first();
	await expect(diagram.locator('svg').first()).toBeVisible({ timeout: 30_000 });
	expect(errors).toEqual([]);
});

test('admin remains private, missing articles remain real 404s', async ({ request, baseURL }) => {
	const admin = await request.get('/admin', { maxRedirects: 0 });
	expect(admin.status()).toBe(303);
	expect(admin.headers()['location']).toBe('/admin/login');
	expect(admin.headers()['cache-control']).toContain('no-store');
	const missing = await request.get('/pagine/not-a-real-article-regression-test');
	expect(missing.status()).toBe(404);
	expect(await missing.text()).toContain('noindex,follow');
	const upload = await request.post('/api/media', {
		maxRedirects: 0,
		headers: { Origin: new URL(baseURL!).origin },
		multipart: {
			file: {
				name: 'rejected.txt',
				mimeType: 'text/plain',
				buffer: Buffer.from('anonymous uploads must be rejected')
			}
		}
	});
	expect(upload.status()).toBe(303);
	expect(upload.headers()['cache-control']).toContain('no-store');
});

test('login validation and cross-origin rejection work after the framework migration', async ({
	request,
	baseURL
}) => {
	const response = await request.post('/admin/login?/login', {
		headers: {
			Origin: new URL(baseURL!).origin,
			Accept: 'application/json',
			'x-sveltekit-action': 'true'
		},
		form: { email: '', password: '' }
	});
	expect(response.status()).toBe(400);
	expect(await response.text()).toContain('Inserisci email e password.');
	expect(response.headers()['cache-control']).toContain('no-store');
	const crossOrigin = await request.post('/api/media', {
		headers: { Origin: 'https://untrusted.example' },
		form: { test: 'rejected before upload handling' }
	});
	expect(crossOrigin.status()).toBe(403);
});

test('login UI hydrates without exposing an authenticated editor', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/admin/login');
	await expect(page.locator('input[name="email"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
	await expect(page.locator('.admin-layout')).toHaveCount(0);
	expect(errors).toEqual([]);
});

test('static pages work without JavaScript, sitemap excludes non-indexable pages', async ({
	browser,
	request
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/data');
	await expect(page.locator('nav a[href="/now"]')).toBeAttached();
	await expect(page.getByText('Daniele Avolio: DATI')).toBeVisible();
	await context.close();
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	const xml = await response.text();
	expect(xml).toContain('/pagine/opencode-e-le-balene');
	expect(xml).not.toContain('/admin');
	expect(xml).not.toContain('/end-of-the-lova');
	expect(xml).not.toContain('/rss.xml');
	const secret = await request.get('/end-of-the-lova');
	expect(secret.headers()['x-robots-tag']).toContain('noindex');
	const og = await request.get('/og/pagine/opencode-e-le-balene.svg');
	expect(og.status()).toBe(200);
	expect(og.headers()['content-type']).toContain('image/svg+xml');
});

test('mobile menu opens and navigates without duplicate headers', async ({ page, isMobile }) => {
	test.skip(!isMobile);
	await page.goto('/');
	await page.getByRole('button', { name: 'Apri menu' }).click();
	await page.locator('.hidden-menu a[href="/now"]').click();
	await expect(page).toHaveURL(/\/now$/);
	await expect(page.locator('.hidden-menu')).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'Cerca nel sito' })).toHaveCount(1);
});
