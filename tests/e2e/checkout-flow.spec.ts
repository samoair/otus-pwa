import { test, expect } from '@playwright/test';

// E2E test: login → browse products → add to cart → verify order page

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'A test product for E2E',
    category: 'electronics',
    image: 'https://via.placeholder.com/150',
    rating: { rate: 4.5, count: 10 },
  },
];

test('should complete checkout flow', async ({ page }) => {
  // Mock external APIs for reliable E2E tests
  await page.route(
    (url) => url.toString().includes('fakestoreapi.com'),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCTS),
      }),
  );

  await page.route(
    (url) => url.toString().includes('httpbin.org'),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ json: { success: true } }),
      }),
  );

  // ================================================================
  // Step 1: Login
  // ================================================================
  await page.goto('#/login');

  // Quasar q-input renders native <input> without name attributes.
  await page.waitForSelector('input[type="email"]');

  // ФИО — first text input in the login form
  const loginFields = page.locator('form .q-field');
  await loginFields.nth(0).locator('input').fill('Иван Иванов');
  await page.locator('input[type="email"]').fill('test@example.com');

  await page.getByRole('button', { name: 'Войти' }).click();

  // Login redirects to home (#/) by default
  await page.waitForURL(/#\/$/, { timeout: 10000 });

  // Verify auth persisted
  const authFlag = await page.evaluate(() => localStorage.getItem('otus-pwa-auth'));
  expect(authFlag).toBe('true');

  // ================================================================
  // Step 2: Browse products & add to cart
  // ================================================================
  await page.getByText('Каталог').click();
  await page.waitForSelector('.product-card', { timeout: 10000 });

  // Add first product to cart
  await page
    .locator('.product-card')
    .first()
    .getByRole('button', { name: /в корзину/i })
    .click();

  // Wait for cart summary bar to appear
  await page.waitForSelector('.bg-blue-1');

  // ================================================================
  // Step 3: Verify order page shows cart items and form
  // ================================================================
  await page.getByText('Заказ').click();
  await page.waitForSelector('.q-stepper', { timeout: 10000 });

  // Verify order page header
  await expect(page.getByText('Оформление заказа')).toBeVisible();

  // Verify the stepper is rendered (multi-step form)
  await expect(page.getByText('Личные данные')).toBeVisible();
  await expect(page.getByText('Адрес доставки')).toBeVisible();
  await expect(page.getByText('Данные оплаты')).toBeVisible();
  await expect(page.getByText('Подтверждение')).toBeVisible();

  // Verify pre-filled user data from login (ФИО and email)
  const fioValue = await page
    .locator('.q-field')
    .filter({ hasText: 'ФИО' })
    .locator('input')
    .inputValue();
  expect(fioValue).toBe('Иван Иванов');

  const emailValue = await page.locator('input[type="email"]').inputValue();
  expect(emailValue).toBe('test@example.com');
});
