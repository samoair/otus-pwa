---
name: Verify cart is cleared after checkout in E2E tests with Playwright
description: Add assertion to confirm cart state is reset post-checkout in Vue SPA workflows
source: auto-skill
extracted_at: '2026-06-03T12:00:00.001Z'
---

In end-to-end tests simulating a checkout flow (login → add product → submit order), it's critical to validate that the cart is properly cleared after successful purchase — not just that the order form submits.

**Solution:** After verifying the redirect to the success page, use `page.evaluate()` to read the `localStorage` cart state and assert it is empty.

**Why:** A successful UI redirect does not guarantee internal state was correctly reset. If the cart is not cleared, the user may see stale products on subsequent visits, or the cart badge may display incorrect counts. This is a hidden regression risk that UI-only assertions miss.

**How to apply:**
- After asserting successful redirect to `/success` (or equivalent)
- Add a step to extract the cart from `localStorage` using `page.evaluate()`
- Assert that the cart array length is zero
- Do not assume UI behavior implies state correctness — validate the backing data

Example:
```ts
await expect(page).toHaveURL('#/success');
await expect(page.locator('h1:has-text("Спасибо за заказ!")')).toBeVisible();

// Verify cart is cleared
const cartCount = await page.evaluate(() => {
  const cartStore = JSON.parse(localStorage.getItem('otus-pwa-cart') || '[]');
  return cartStore.length;
});
expect(cartCount).toBe(0);
```

Apply this pattern to any E2E test involving shopping carts, wishlists, or temporary state that should reset after a transaction. This ensures both UI and state integrity are validated — a key differentiator for production-grade test suites.