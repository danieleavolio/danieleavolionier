import { expect, test } from '@playwright/test';

test('related articles are crawlable without JavaScript and sit between body and sharing', async ({
	browser
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	try {
		const page = await context.newPage();
		await page.goto('/pagine/implementare-search-engine-sveltekit');
		const section = page.getByRole('region', { name: 'Leggi anche' });
		const links = section.getByRole('link');
		await expect(links).toHaveCount(3);
		const hrefs = await links.evaluateAll((elements) =>
			elements.map((element) => element.getAttribute('href'))
		);
		expect(hrefs).toContain('/pagine/filter-system');
		expect(hrefs).toContain('/pagine/come-ho-refactorato-il-mio-sito-svelte-con-codex-');
		expect(hrefs).not.toContain('/pagine/implementare-search-engine-sveltekit');
		expect(new Set(hrefs).size).toBe(hrefs.length);
		expect(
			await section.evaluate(
				(element) =>
					element.previousElementSibling?.classList.contains('rich-content') &&
					element.nextElementSibling?.classList.contains('share-buttons')
			)
		).toBe(true);
		expect(await section.textContent()).not.toMatch(/affinità|\d+%/i);
	} finally {
		await context.close();
	}
});

test('related navigation updates the article, canonical and suggestions with native fonts and focus', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	const nativeHeadingFont = await page
		.locator('.latest-panel h2')
		.first()
		.evaluate((element) => getComputedStyle(element).fontFamily);
	await page.goto('/pagine/implementare-search-engine-sveltekit');
	const section = page.locator('.related-posts');
	expect(
		await section.locator('h2').evaluate((element) => getComputedStyle(element).fontFamily)
	).toBe(nativeHeadingFont);
	const typography = await section.evaluate((element) => ({
		titleFont: getComputedStyle(element.querySelector('h3')!).fontFamily,
		nativeTitleFont: getComputedStyle(document.querySelector('hgroup h3')!).fontFamily,
		titleSize: parseFloat(getComputedStyle(element.querySelector('h3')!).fontSize),
		descriptionSize: parseFloat(getComputedStyle(element.querySelector('.description')!).fontSize)
	}));
	expect(typography.titleFont).toBe(typography.nativeTitleFont);
	expect(typography.titleSize).toBeGreaterThanOrEqual(typography.descriptionSize);
	const card = section.locator('a').first();
	await card.scrollIntoViewIfNeeded();
	await page.keyboard.press('Tab');
	await card.focus();
	expect(await card.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
	const target = await card.getAttribute('href');
	await card.click();
	await expect(page).toHaveURL(new RegExp(`${target}$`));
	await expect(page.locator('hgroup h1')).toHaveText('Implementazione di un Sistema di Filtri');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		`https://www.danieleavolio.it${target}`
	);
	expect(
		await page
			.locator('.related-posts a')
			.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
	).not.toContain(target);
	await page.goBack();
	await expect(page.locator('hgroup h1')).toHaveText(
		'Come implementare un motore di ricerca in SvelteKit'
	);
	expect(errors).toEqual([]);
});
