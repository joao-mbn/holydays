import { parseDateToInputString } from '@/app/utils/datetime';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.describe('header', () => {
  test('h1 has correct title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Holydays');
  });
  test('h2 has correct subtitle', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Get the most out of your vacations');
  });
});

test.describe('footer', () => {
  test('Footer is visible and contain correct text', async ({ page }) => {
    await expect(page.locator('footer')).toHaveText('Made with ❤️ by João');
  });

  test('Clicking on link redirects to my github page', async ({ page }) => {
    const githubPromise = page.waitForEvent('popup');
    await page.getByTestId('github-link').click();
    const githubPage = await githubPromise;
    expect(githubPage.url()).toContain('https://github.com/joao-mbn');
  });
});

test.describe('form', () => {
  test.describe('duration input', () => {
    test('duration input to default to minimum value when empty', async ({ page }) => {
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('');
      await expect(page.getByTestId('duration-input')).toHaveValue('0');
    });

    test('duration input to truncate to maximum value when inputted value exceeds it', async ({ page }) => {
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('600');
      await expect(page.getByTestId('duration-input')).toHaveValue('60');
    });
  });

  test.describe('date inputs', () => {
    test('date truncation when clicking out, when start date is smaller than today', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('start-date-picker')).toHaveValue(parseDateToInputString(today));
    });

    test('date truncation when clicking out, when end date is bigger than one year from today', async ({ page }) => {
      const today = new Date();
      const upperLimit = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      const endDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('end-date-picker')).toHaveValue(parseDateToInputString(upperLimit));
    });

    test('date swap when clicking out, when start date is set bigger than end date and both are in the valid interval', async ({
      page,
    }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('form-section').click();

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('start-date-picker')).toHaveValue(parseDateToInputString(endDate));
      await expect(page.getByTestId('end-date-picker')).toHaveValue(parseDateToInputString(startDate));
    });

    test('date swap when clicking out, when end date is set smaller than start date and both are in the valid interval', async ({
      page,
    }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('form-section').click();

      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('start-date-picker')).toHaveValue(parseDateToInputString(endDate));
      await expect(page.getByTestId('end-date-picker')).toHaveValue(parseDateToInputString(startDate));
    });

    test('date swap when clicking with truncation out, when end date is set smaller than today date and start date is in valid interval', async ({
      page,
    }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
      const endDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('form-section').click();

      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('start-date-picker')).toHaveValue(parseDateToInputString(today));
      await expect(page.getByTestId('end-date-picker')).toHaveValue(parseDateToInputString(startDate));
    });

    test('date swap when clicking with truncation out, when start date is set bigger than one year from today and end date is in valid interval', async ({
      page,
    }) => {
      const today = new Date();
      const upperLimit = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      const startDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('form-section').click();

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('start-date-picker')).toHaveValue(parseDateToInputString(endDate));
      await expect(page.getByTestId('end-date-picker')).toHaveValue(parseDateToInputString(upperLimit));
    });
  });

  test.describe('validation message', () => {
    test('validation message will show if duration is bigger than date difference', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() + 2);

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('5');
      await expect(page.getByTestId('validation-message')).toHaveText(
        "These vacations won't be very good if I'm taking more days off than there are days to look for. 🤔"
      );
    });

    test('validation message will not show if data is valid', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() + 10);

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('5');
      await expect(page.getByTestId('validation-message')).not.toBeVisible();
    });

    test('validation message will not show if start date is invalid', async ({ page }) => {
      await page.getByTestId('start-date-picker').fill('');
      await expect(page.getByTestId('validation-message')).not.toBeVisible();
    });

    test('validation message will not show if end date is invalid', async ({ page }) => {
      await page.getByTestId('end-date-picker').fill('');
      await expect(page.getByTestId('validation-message')).not.toBeVisible();
    });
  });

  test.describe('button', () => {
    test('will be enabled if dates are valid and no validation message is present', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('5');

      if (await page.getByTestId('validation-message').isHidden()) {
        await expect(page.getByTestId('search-button')).toBeEnabled();
      }
    });

    test('will be disabled if start date is invalid', async ({ page }) => {
      await page.getByTestId('start-date-picker').fill('');
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('search-button')).toBeDisabled();
    });

    test('will be disabled if end date is invalid', async ({ page }) => {
      await page.getByTestId('end-date-picker').fill('');
      await page.getByTestId('form-section').click();

      await expect(page.getByTestId('search-button')).toBeDisabled();
    });

    test('will be disabled if there is a validation message', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('5');

      if (await page.getByTestId('validation-message').isVisible()) {
        await expect(page.getByTestId('search-button')).toBeDisabled();
      }
    });
  });

  test.describe('output', () => {
    test('It is hidden by default', async ({ page }) => {
      await expect(page.getByTestId('output-section')).not.toBeVisible();
    });

    test('It shows up by filling the form and clicking to get the results', async ({ page }) => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

      await page.getByTestId('start-date-picker').fill(parseDateToInputString(startDate));
      await page.getByTestId('end-date-picker').fill(parseDateToInputString(endDate));
      await page.getByTestId('duration-input').click();
      await page.getByTestId('duration-input').fill('15');
      await page.getByTestId('search-button').click();

      await expect(page.getByTestId('output-section')).toBeVisible();
    });
  });
});

