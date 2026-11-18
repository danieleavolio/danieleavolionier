import { expect, test } from '@playwright/test';

test('author and share panel keep square controls and report clipboard results', async ({
	page
}) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: {
				writeText: async (text: string) => {
					Reflect.set(window, '__copiedLink', text);
				}
			}
		});
	});
	await page.goto('/pagine/opencode-e-le-balene');
	const author = page.getByRole('region', { name: "Informazioni sull'autore" });
	await expect(author).toBeVisible();
	await expect(author.getByRole('link')).toHaveCount(3);
	await expect(author.getByRole('link', { name: 'LinkedIn' })).toHaveCSS('border-radius', '0px');
	await page.getByRole('button', { name: 'Copia il link' }).click();
	await expect(page.getByRole('status')).toHaveText('Link copiato.');
	expect(await page.evaluate(() => Reflect.get(window, '__copiedLink'))).toContain(
		'/pagine/opencode-e-le-balene'
	);
	await page.getByRole('link', { name: 'Condividi su X' }).hover();
	await expect(page.getByRole('link', { name: 'Condividi su X' })).toHaveCSS(
		'color',
		'rgb(200, 194, 170)'
	);
	await author.scrollIntoViewIfNeeded();
	await page.screenshot({ path: `test-results/author-panel-${test.info().project.name}.png` });
	await page.evaluate(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: {
				writeText: async () => {
					throw new Error('denied');
				}
			}
		});
	});
	await page.getByRole('button', { name: 'Copia il link' }).click();
	await expect(page.getByRole('status')).toContainText('Copia non riuscita');
});

test('mobile menu keeps labels aligned and swatches fixed on hover and focus', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Apri menu' }).click();
	const menu = page.getByRole('dialog', { name: 'Menu di navigazione' });
	await expect(menu).toBeVisible();
	const links = menu.getByRole('link');
	await expect(links).toHaveCount(6);
	const boxes = await links.evaluateAll((elements) =>
		elements.map((el) => {
			const r = el.getBoundingClientRect();
			return { x: r.x, width: r.width };
		})
	);
	for (const box of boxes) expect(box).toEqual(boxes[0]);
	for (const link of await links.all()) {
		await link.hover();
		await link.focus();
		await expect(link).toHaveCSS('color', 'rgb(200, 194, 170)');
		await expect(link).toHaveCSS('background-color', 'rgb(77, 73, 62)');
		const state = await link.evaluate((el) => {
			const s = getComputedStyle(el);
			const swatch = getComputedStyle(el, '::before');
			return {
				swatchWidth: parseFloat(swatch.width),
				color: s.color,
				background: s.backgroundColor,
				clipped: el.scrollWidth > el.clientWidth
			};
		});
		expect(state.swatchWidth).toBe(12);
		expect(state.color).not.toBe(state.background);
		expect(state.clipped).toBe(false);
	}
	await page.screenshot({ path: 'test-results/menu-mobile-fixed.png' });
	await page.keyboard.press('Escape');
	await expect(menu).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'Apri menu' })).toBeFocused();
});

test('category filters support keyboard selection and reset on both listings', async ({ page }) => {
	for (const path of ['/pagine', '/progetti']) {
		await page.goto(path);
		const count = await page.locator('.post').count();
		await page.getByRole('button', { name: /^FILTRI/ }).click();
		const filter = page.locator('.filter-item').first();
		await filter.focus();
		await page.keyboard.press('Space');
		await expect(filter).toHaveAttribute('aria-pressed', 'true');
		await expect.poll(() => page.locator('.post').count()).toBeLessThan(count);
		await page.getByRole('button', { name: 'RIPRISTINA' }).click();
		await expect(page.locator('.post')).toHaveCount(count);
		await expect(filter).toHaveAttribute('aria-pressed', 'false');
	}
});

test('card hover preserves title and badge contrast', async ({ page }) => {
	await page.goto('/pagine');
	const card = page.locator('.post').first();
	await card.hover();
	await expect(card).toHaveCSS('background-color', 'rgb(77, 73, 62)');
	await expect(card.locator('.title')).toHaveCSS('color', 'rgb(200, 194, 170)');
	await expect(card.locator('.tag').first()).toHaveCSS('color', 'rgb(200, 194, 170)');
});
