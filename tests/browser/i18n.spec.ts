import { expect, test } from '@playwright/test';

test('defaults to Italian for an Italian device', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'PROGETTI' }).first()).toBeVisible();
	await expect(page.locator('html')).toHaveAttribute('lang', 'it');
});

test.describe('English device', () => {
	test.use({ locale: 'en-US' });

	test('detects English and switches back to Italian from the header', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'PROJECTS' }).first()).toBeVisible();
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');

		await page.getByRole('button', { name: 'Language' }).click();
		await expect(page.getByRole('link', { name: 'PROGETTI' }).first()).toBeVisible();
		await expect(page.locator('html')).toHaveAttribute('lang', 'it');
	});
});
