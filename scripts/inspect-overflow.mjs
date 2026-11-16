import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:5175';
const label = process.argv[3] || 'overflow';
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const browser = await chromium.launch();
const results = [];
try {
	for (const width of [320, 390, 768]) {
		const page = await browser.newPage({ viewport: { width, height: 844 } });
		for (const pathname of paths) {
			await page.goto(new URL(pathname, base).href);
			await page.evaluate(() => document.fonts.ready);
			const result = await page.evaluate(() => ({
				width: innerWidth,
				scrollWidth: document.documentElement.scrollWidth,
				offenders: [...document.querySelectorAll('main *')]
					.filter((element) => {
						const rect = element.getBoundingClientRect();
						return (
							rect.width > 0 &&
							rect.right > innerWidth + 1 &&
							getComputedStyle(element).visibility !== 'hidden'
						);
					})
					.slice(0, 12)
					.map((element) => ({
						tag: element.tagName,
						class: element.className,
						text: element.textContent.slice(0, 80),
						width: Math.round(element.getBoundingClientRect().width),
						right: Math.round(element.getBoundingClientRect().right)
					}))
			}));
			results.push({ pathname, ...result });
			if (result.scrollWidth > width + 1) console.log(JSON.stringify({ pathname, ...result }));
		}
		await page.close();
	}
} finally {
	await browser.close();
}
await mkdir('test-results', { recursive: true });
await writeFile(`test-results/${label}.json`, JSON.stringify(results, null, 2));
console.log(
	`${results.filter((result) => result.scrollWidth > result.width + 1).length}/${results.length} pages overflow`
);
