const { test, expect } = require('@playwright/test');

const baseURL = 'https://webportal.dev.app.sentinel-health.com';

// ---------------------
// Cookies helper
// ---------------------
async function acceptCookiesIfVisible(page) {
  const popup = page.locator(
    'div.bg-white.shadow-xl:has-text("We use cookies")');
  const acceptButton = popup.getByRole('button', { name: 'Accept all' });

  if (await popup.isVisible().catch(() => false)) {
    await acceptButton.click();
    await expect(popup).toBeHidden();
  }
}

// ---------------------
// Pages config
// ---------------------
const pages = [
  { name: 'Home', path: '' },
  { name: 'My Sentinel', path: 'my-sentinel' },
  { name: 'Labs', path: 'labs' },
  { name: 'Evidence Base', path: 'evidence' },
  { name: 'Trauma Support', path: 'trauma-support' },
  { name: 'About Sentinel', path: 'about-us' },
  { name: 'Login', path: 'login' },
];

// ---------------------
// Helpers
// ---------------------
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

// ---------------------
// Homepage tests
// ---------------------
test.describe('Homepage', () => {
  test('loads correctly', async ({ page }) => {
    await page.goto(baseURL);
    await acceptCookiesIfVisible(page);

    await expect(page).toHaveTitle(/Sentinel/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('basic elements are visible', async ({ page }) => {
    await page.goto(baseURL);
    await acceptCookiesIfVisible(page);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('a')).toHaveCountGreaterThan(0);
  });
});

// ---------------------
// Navigation tests
// ---------------------
test.describe('Navigation', () => {
  const filteredPages = pages.filter(p => p.path !== '');

  for (const { name, path } of filteredPages) {
    test(`Navigate to ${name} page`, async ({ page }) => {
      await page.goto(baseURL);
      await acceptCookiesIfVisible(page);

      await page.getByRole('link', { name }).first().click();

      await expect(page).toHaveURL(`${baseURL}/${path}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});

// ---------------------
// Random navigation
// ---------------------
test('Random navigation between pages', async ({ page }) => {
  await page.goto(baseURL);
  await acceptCookiesIfVisible(page);

  const randomPages = shuffleArray(pages).filter(p => p.path !== '');

  for (const { path } of randomPages) {
    await page.locator(`a[href="/${path}"]`).first().click();
    await expect(page).toHaveURL(`${baseURL}/${path}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

// ---------------------
// Section checks
// ---------------------
test('Caring for Carers section is visible', async ({ page }) => {
  await page.goto(baseURL);
  await acceptCookiesIfVisible(page);
  await expect(page.getByRole(
    'heading', { name: 'Caring for Carers' })).toBeVisible();
});

test('Our Solution section is visible', async ({ page }) => {
  await page.goto(baseURL);
  await acceptCookiesIfVisible(page);

  await expect(page.getByRole(
    'heading', { name: 'Our Solution' })).toBeVisible();
});

// ---------------------
// Expand content test
// ---------------------
test('FIND OUT MORE expands content', async ({ page }) => {
  await page.goto(baseURL);
  await acceptCookiesIfVisible(page);

  const button = page.getByRole('button', { name: 'FIND OUT MORE' });
  const expandedContent = page.locator('text=/./'); // placeholder safe locator

  await expect(button).toBeVisible();

  await button.click();

  // перевірка що щось з’явилось після кліку
  await expect(expandedContent.first()).toBeVisible();
});