---
name: Wait for Vue Router hash mode render in Playwright E2E tests
description: Add explicit waits for DOM elements after navigation in Vue 3 SPA with hash mode routing
source: auto-skill
extracted_at: '2026-06-02T13:54:54.634Z'
---

When testing a Vue 3 SPA using Vue Router in hash mode (e.g., `#/login`) with Playwright, navigation may complete before the Vue app hydrates and renders the target component. This causes `page.fill()` or `page.click()` to fail with "element not found" errors.

**Solution:** Always use `await page.waitForSelector()` with a reasonable timeout (e.g., 10000ms) after `page.goto('#/route')` and before interacting with any form or component element.

**Why:** Vue’s client-side rendering and hash router initialization are asynchronous. Playwright’s `goto()` resolves when the HTML loads, not when the Vue app has rendered the component into the DOM. Without waiting, tests run too early and fail flakily.

**How to apply:**
- After every `page.goto('#/route')`, insert `await page.waitForSelector('selector-for-target-element', { timeout: 10000 })`
- Use specific, stable selectors (e.g., `input[name="email"]`, `button:has-text("Войти")`)
- Avoid relying on `page.waitForTimeout()` — it's brittle; use element-based waits instead
- Apply this pattern to all E2E tests in hash-mode Vue SPAs

Example:
```ts
await page.goto('#/login');
await page.waitForSelector('input[name="email"]', { timeout: 10000 });
await page.fill('input[name="email"]', 'test@example.com');
```

This pattern ensures reliable, non-flaky tests for any Vue 3 + hash mode application.