import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.argv[3] || process.env.SITE_URL || 'http://127.0.0.1:5174';
const directory = path.resolve('test-results', process.argv[2] || 'capture');
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
	for (const viewport of [
		{ width: 1440, height: 1000 },
		{ width: 390, height: 844 }
	]) {
		const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
		for (const route of [
			'/',
			'/pagine',
			'/pagine/opencode-e-le-balene',
			'/progetti',
			'/data',
			'/appunti'
		]) {
			const page = await context.newPage();
			const errors = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.addInitScript(() => {
				window.__lastLcp = 0;
				new PerformanceObserver((list) => {
					window.__lastLcp = list.getEntries().at(-1)?.startTime || 0;
				}).observe({ type: 'largest-contentful-paint', buffered: true });
			});
			const response = await page.goto(new URL(route, baseURL).href, {
				waitUntil: 'domcontentloaded'
			});
			if (viewport.width > 1300) await page.locator('nav .links').waitFor({ state: 'visible' });
			await page.evaluate(() =>
				Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5000))])
			);
			await page.waitForTimeout(700);
			const name = `${viewport.width}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}`;
			await page.screenshot({
				path: path.join(directory, `${name}.png`),
				fullPage: true,
				animations: 'disabled'
			});
			results.push({
				route,
				viewport,
				status: response.status(),
				errors,
				...(await page.evaluate(() => {
					const navigation = performance.getEntriesByType('navigation')[0];
					return {
						ttfb: navigation.responseStart - navigation.requestStart,
						lcp: window.__lastLcp,
						resources: performance.getEntriesByType('resource').map((entry) => ({
							url: entry.name,
							bytes: entry.encodedBodySize,
							duration: entry.duration
						})),
						height: document.documentElement.scrollHeight,
						width: document.documentElement.scrollWidth
					};
				}))
			});
			await page.close();
		}
		await context.close();
	}
} finally {
	await browser.close();
}
await writeFile(path.join(directory, 'measurements.json'), JSON.stringify(results, null, 2));
console.log(
	JSON.stringify(
		results.map(({ resources, ...result }) => ({
			...result,
			resourceBytes: resources.reduce((sum, item) => sum + item.bytes, 0)
		})),
		null,
		2
	)
);
