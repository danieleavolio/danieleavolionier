import { readFile } from 'node:fs/promises';

const report = JSON.parse(
	await readFile(process.argv[2] || 'test-results/lighthouse-mobile.json', 'utf8')
);
console.log(
	JSON.stringify(
		{
			url: report.finalDisplayedUrl,
			scores: Object.fromEntries(
				Object.entries(report.categories).map(([name, category]) => [
					name,
					Math.round(category.score * 100)
				])
			),
			metrics: Object.fromEntries(
				[
					'first-contentful-paint',
					'largest-contentful-paint',
					'total-blocking-time',
					'cumulative-layout-shift',
					'speed-index'
				].map((name) => [name, report.audits[name]?.displayValue])
			),
			failures: Object.values(report.audits)
				.filter(
					(audit) =>
						audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'informative'
				)
				.map(({ id, title, displayValue }) => ({ id, title, displayValue }))
		},
		null,
		2
	)
);
