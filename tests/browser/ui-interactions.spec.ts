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

test('theme toggle switches palette and persists across reloads', async ({ page }) => {
	await page.goto('/');
	const html = page.locator('html');
	const lightBg = await html.evaluate((element) => getComputedStyle(element).backgroundColor);
	await page.getByRole('button', { name: 'Passa al tema scuro' }).click();
	await expect(html).toHaveAttribute('data-theme', 'dark');
	const darkBg = await html.evaluate((element) => getComputedStyle(element).backgroundColor);
	expect(darkBg).not.toBe(lightBg);
	await expect(page.getByRole('button', { name: 'Passa al tema chiaro' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.reload();
	await expect(html).toHaveAttribute('data-theme', 'dark');
	await page.getByRole('button', { name: 'Passa al tema chiaro' }).click();
	await expect(html).toHaveAttribute('data-theme', 'light');
});

test('photo avatar and custom icons render on the home page', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.avatar-photo img')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Cerca nel sito' }).locator('svg')).toHaveCount(1);
});

test('photo avatar spins to Emi with mouse drag and touch drag', async ({ page }) => {
	await page.goto('/');
	const avatar = page.locator('.avatar-photo');
	await avatar.scrollIntoViewIfNeeded();
	const box = await avatar.boundingBox();
	expect(box).not.toBeNull();
	const rotor = page.locator('.avatar-rotor');
	const initial = await rotor.evaluate((element) => getComputedStyle(element).transform);
	await avatar.hover();
	await expect(avatar).toHaveCSS('box-shadow', 'none');
	await expect(avatar).toHaveCSS('outline-style', 'none');

	const midY = box!.y + box!.height / 2;
	await page.mouse.move(box!.x + 20, midY);
	await page.mouse.down();
	await page.mouse.move(box!.x + box!.width - 20, midY, { steps: 5 });
	await page.mouse.up();
	await page.waitForTimeout(150);
	const afterMouse = await rotor.evaluate((element) => getComputedStyle(element).transform);
	expect(afterMouse).not.toBe(initial);
	await page.waitForTimeout(350);
	const afterInertia = await rotor.evaluate((element) => getComputedStyle(element).transform);
	expect(afterInertia).not.toBe(afterMouse);

	await avatar.evaluate((element) => {
		const rect = element.getBoundingClientRect();
		const y = rect.top + rect.height / 2;
		const event = (type: string, x: number) =>
			new PointerEvent(type, {
				pointerId: 7,
				pointerType: 'touch',
				clientX: x,
				clientY: y,
				bubbles: true
			});
		element.dispatchEvent(event('pointerdown', rect.left + 20));
		element.dispatchEvent(event('pointermove', rect.left + rect.width - 20));
		element.dispatchEvent(event('pointerup', rect.left + rect.width - 20));
	});
	await page.waitForTimeout(150);
	const afterTouch = await rotor.evaluate((element) => getComputedStyle(element).transform);
	expect(afterTouch).not.toBe(afterMouse);
});

test('latest panel rows open their article from anywhere', async ({ page }) => {
	await page.goto('/');
	const item = page.locator('.latest-panel .yr-item').first();
	await item.scrollIntoViewIfNeeded();
	const box = await item.boundingBox();
	expect(box).not.toBeNull();
	await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height - 8);
	await expect(page).toHaveURL(/\/pagine\//);
});

test('whole post card opens the article while tags keep filtering', async ({ page }) => {
	await page.goto('/pagine');
	const card = page.locator('.post').first();
	const box = await card.boundingBox();
	expect(box).not.toBeNull();
	await page.mouse.click(box!.x + box!.width - 24, box!.y + box!.height / 2);
	await expect(page).toHaveURL(/\/pagine\/[^/]+$/);

	await page.goBack();
	await expect(page.locator('.post').first()).toBeVisible();
	const count = await page.locator('.post').count();
	await page.locator('.post').first().locator('.tag').first().click();
	await expect(page).toHaveURL(/\/pagine$/);
	await expect.poll(() => page.locator('.post').count()).toBeLessThan(count);
});
