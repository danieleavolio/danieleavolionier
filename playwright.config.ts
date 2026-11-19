import { defineConfig } from '@playwright/test';

const remoteURL = process.env.SITE_URL;

export default defineConfig({
	testDir: './tests/browser',
	outputDir: 'test-results/playwright',
	fullyParallel: false,
	workers: 2,
	timeout: 45_000,
	use: {
		baseURL: remoteURL || 'http://127.0.0.1:4173',
		trace: 'retain-on-failure',
		locale: 'it-IT'
	},
	projects: [
		{ name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
		{
			name: 'mobile',
			use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
		}
	],
	webServer: remoteURL
		? undefined
		: {
				command: 'npm run preview -- --host 127.0.0.1 --port 4173',
				url: 'http://127.0.0.1:4173',
				reuseExistingServer: !process.env.CI
			}
});
