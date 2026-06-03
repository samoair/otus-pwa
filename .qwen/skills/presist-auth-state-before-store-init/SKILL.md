---
name: Pre-populate localStorage before Pinia store instantiation in unit tests
description: Ensure mock auth state is set in localStorage before creating Pinia stores to avoid hydration failures
source: auto-skill
extracted_at: '2026-06-03T12:00:00.000Z'
---

When unit testing Pinia stores that restore state from `localStorage` (e.g., authentication status or user profile), the store may initialize before the test has a chance to set mock values — resulting in `null` state and failed assertions.

**Solution:** In your test's `beforeEach()` block, explicitly populate `localStorage` with the expected state *before* calling `useStore()` or creating a new Pinia instance.

**Why:** Pinia stores are instantiated at module import time. If `localStorage` is empty when the store module loads (via `import { useUserStore } from '@/stores/user-store'`), the `restore()` action runs immediately and sets `user = null`, making subsequent test modifications ineffective. Setting `localStorage` *after* the store is instantiated has no effect.

**How to apply:**
- In every unit test file that uses a store reading from `localStorage`, set mock values in `localStorage` within `beforeEach()` *before* calling `createPinia()` or `useStore()`
- Clear `localStorage` at the start of `beforeEach()` to avoid state leakage
- Always validate that `localStorage` was set correctly before asserting on store state

Example:
```ts
beforeEach(() => {
  localStorage.clear();
  // Pre-populate BEFORE creating the store
  localStorage.setItem('otus-pwa-auth', 'true');
  localStorage.setItem('otus-pwa-user', JSON.stringify(mockUser));
  setActivePinia(createPinia()); // store instantiation happens here
});

it('restores user data from localStorage', () => {
  const store = useUserStore();
  expect(store.user).toEqual(mockUser);
});
```

Apply this pattern to any store that persists state via `localStorage`, including `CartStore`, `UserStore`, or custom persistent stores. This ensures deterministic, reliable unit tests without flaky hydration behavior.