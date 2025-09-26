import { expect, test } from '@playwright/test';

test.describe('Flight App', () => {
  test('Suche von London nach Paris und ändere auf Wien', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Flights' }).click();

    await page.getByTestId('inp-from').fill('Wien');
    await page.getByRole('button', { name: 'Search' }).click();

    await page
      .getByTestId('flight-card')
      .first()
      .getByRole('link', { name: 'Bearbeiten' })
      .click();

    await expect(page.getByRole('textbox', { name: 'From' })).toHaveValue(
      'Wien',
    );
    await page.getByRole('textbox', { name: 'from' }).fill('London');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Ihr Flug wurde gespeichert')).toBeVisible();
  });
});
