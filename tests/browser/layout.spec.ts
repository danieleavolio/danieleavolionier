import { expect, test } from '@playwright/test';

test('all sitemap pages fit narrow and tablet viewports without hiding document overflow', async ({
	page,
	request,
	isMobile
}) => {
	test.skip(!isMobile);
	test.setTimeout(180_000);
	const sitemap = await (await request.get('/sitemap.xml')).text();
	const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
		(match) => new URL(match[1]).pathname
	);
	for (const width of [320, 390, 768]) {
		await page.setViewportSize({ width, height: 844 });
		for (const pathname of paths) {
			await page.goto(pathname);
			await page.evaluate(() => document.fonts.ready);
			const dimensions = await page.evaluate(() => ({
				viewport: innerWidth,
				document: document.documentElement.scrollWidth,
				overflow: getComputedStyle(document.documentElement).overflowX
			}));
			expect(dimensions.document, `${pathname} at ${width}px`).toBeLessThanOrEqual(
				dimensions.viewport + 1
			);
			expect(['hidden', 'clip']).not.toContain(dimensions.overflow);
		}
	}
});

test('wide tables scroll locally and long links wrap without losing content', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 844 });
	await page.goto('/pagine/opencode-e-le-balene');
	const result = await page.locator('.rich-content').evaluate((container) => {
		const table = container.querySelector('table')!;
		const cell = table.querySelector('td')!;
		// Local-only fixture: simulate content wider than any phone, without modifying the CMS.
		cell.textContent = 'wide-table-content-'.repeat(40);
		cell.style.whiteSpace = 'nowrap';
		table.scrollLeft = 100;
		return {
			viewport: innerWidth,
			document: document.documentElement.scrollWidth,
			tableWidth: table.clientWidth,
			tableContent: table.scrollWidth,
			scrolled: table.scrollLeft,
			linkPresent: [...container.querySelectorAll('a')].some(
				(link) => link.href === 'https://github.com/djkaty/Il2CppInspector'
			)
		};
	});
	expect(result.document).toBeLessThanOrEqual(result.viewport + 1);
	expect(result.tableContent).toBeGreaterThan(result.tableWidth);
	expect(result.scrolled).toBeGreaterThan(0);
	expect(result.linkPresent).toBe(true);
});
