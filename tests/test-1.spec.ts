import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  page.wait;
  await page.goto('http://localhost:4200/flights/edit/139');
  await page.goto('http://localhost:4200/flights/edit/139');
  page.route('http://', () => {
    json: [];
  });
  await page.getByRole('link', { name: 'Flights' }).click();
  await page.getByTestId('inp-from').click();
  await page.locator('input[name="ng.form0.to"]').click();
  await page.getByTestId('inp-from').dblclick();
  await page.getByTestId('inp-from').fill('Wien');
  await page.getByTestId('btn-search').click();
  await page
    .locator('app-flight-card')
    .filter({
      hasText:
        'SelectDeselectBearbeitenWiener Neustadt - ParisFlugnr. #139Datum:',
    })
    .getByRole('link')
    .click();
  await expect(page.getByRole('textbox', { name: 'from' })).toHaveValue(
    'Wiener Neustadt',
  );
});
