import { test, expect } from '@playwright/test';

test('search for flights from Wien to Paris', async ({ page }) => {
  await page.goto('https://www.orf.at');
  await page.getByRole('button', { name: 'Annehmen und Schließen:' }).click();
  await expect(page.getByText('Lichtblick im Nihtrace')).toBeVisible();
});
