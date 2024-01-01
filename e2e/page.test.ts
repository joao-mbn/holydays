import { parseDateToInputString } from '@/app/utils/datetime';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.describe('header', () => {
  test('h1 has correct title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Holydays');
  });
  test('h2 has correct subtitle', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Get the most out of your vacations');
  });
});

test.describe('footer', () => {
  test('Footer is visible and contain correct text', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Made with ❤️ by João');
  });
});

test.describe('form', () => {
  test('duration input to default to minimum value when empty', async ({ page }) => {
    await page.getByLabel('Input to select number of').click();
    await page.getByLabel('Input to select number of').fill('');
    await expect(page.getByLabel('Input to select number of')).toHaveValue('0');
  });

  test('duration input to truncate to maximum value when inputted value exceeds it', async ({ page }) => {
    await page.getByLabel('Input to select number of').click();
    await page.getByLabel('Input to select number of').fill('600');
    await expect(page.getByLabel('Input to select number of')).toHaveValue('60');
  });

  test('date truncation when clicking out, when initial date is smaller than today', async ({ page }) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    await page.getByLabel('start date picker').fill(parseDateToInputString(startDate));
    await page.getByText('I will takedays off, anywhere fromtoGet the best time!').click();
    await expect(page.getByLabel('start date picker')).toHaveValue(parseDateToInputString(today));
  });

  test("date truncation when clicking out, when end date is bigger next year's last day", async ({ page }) => {
    const today = new Date();
    const upperLimit = new Date(today.getFullYear() + 1, 11, 31);
    const endDate = new Date(today.getFullYear() + 2, 11, 31);

    await page.getByLabel('end date picker').fill(parseDateToInputString(endDate));
    await page.getByText('I will takedays off, anywhere fromtoGet the best time!').click();
    await expect(page.getByLabel('end date picker')).toHaveValue(parseDateToInputString(upperLimit));
  });

  test('date truncation when clicking out, when start date is set bigger than end date', async ({ page }) => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const startDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

    await page.getByLabel('end date picker').fill(parseDateToInputString(endDate));
    await page.getByLabel('start date picker').fill(parseDateToInputString(startDate));

    await page.getByText('I will takedays off, anywhere fromtoGet the best time!').click();
    await expect(page.getByLabel('start date picker')).toHaveValue(parseDateToInputString(endDate));
  });

  test('date truncation when clicking out, when end date is set smaller than start date', async ({ page }) => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const startDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

    await page.getByLabel('start date picker').fill(parseDateToInputString(startDate));
    await page.getByLabel('end date picker').fill(parseDateToInputString(endDate));

    await page.getByText('I will takedays off, anywhere fromtoGet the best time!').click();
    await expect(page.getByLabel('end date picker')).toHaveValue(parseDateToInputString(startDate));
  });
});

// test('test', async ({ page }) => {
//   await page.getByRole('heading', { name: 'Holydays' }).click();
//   await page.getByLabel('start date picker').fill('2024-01-16');
//   await page.getByLabel('end date picker').fill('2024-01-18');
//   await page.getByLabel('Input to select number of').click();
//   await page.getByLabel('Input to select number of').fill('05');
//   await page.getByText('HolydaysGet the most out of your vacationsI will takedays off, anywhere').click();
//   await expect(page.getByText("These vacations won't be very")).toBeVisible();
//   await expect(page.locator('section')).toContainText(
//     "These vacations won't be very good if I'm taking more days off than there are days to look for. 🤔"
//   );
// });

