---
name: Work around Vitest module loading timing to override @testing-library/vue mount
description: Force Vitest to use a mocked mount function by assigning it to window and importing via relative path
source: auto-skill
extracted_at: '2026-06-03T12:11:37.456Z'
---

When unit testing Vue components in Vitest, overriding `@testing-library/vue`'s `mount` function to inject global plugins (like Pinia, Quasar, or mock router) often fails because test files import the original `mount` before `setup.ts` executes — resulting in `TypeError: mount is not a function`.

**Solution:** Define the mocked `mount` function in `setup.ts`, assign it to `window.mount` immediately after definition, and in every test file, use `const mount = (window as any).mount;` to access it — even though this bypasses ESM imports.

**Why:** Vitest resolves and caches module imports in a top-down order. Even if `setup.ts` is listed in `vitest.config.ts` under `setupFiles`, test files like `ProductCard.test.ts` may load and cache `@testing-library/vue/mount` before `setup.ts` runs, making `export { mount }` unusable. Directly assigning `mount` to the global `window` object ensures all test files access the same, correctly configured function, regardless of import order.

**How to apply:**
- In `tests/unit/setup.ts`:
  1. Import `mount` as `originalMount` from `@testing-library/vue`
  2. Define a new `mount` function that wraps `originalMount` and injects required plugins
  3. Immediately assign it to `window.mount = mount`
  4. Export `mount` for documentation purposes (not for use in tests)
- In every test file:
  1. Import `originalMount` from `@testing-library/vue` (only to satisfy TypeScript)
  2. Use `const mount = (window as any).mount;` — do not import from `setup.ts`
- Do NOT use `import { mount } from '../unit/setup'` — it fails due to unresolved module paths or import timing

Example (`setup.ts`):
```ts
import { mount as originalMount } from '@testing-library/vue';

const mount = (...args: any[]) => {
  const [component, options] = args;
  if (!options?.global?.plugins) options.global.plugins = [];
  options.global.plugins.push(mockRouter);
  options.global.plugins.push(mockQuasarPlugin);
  return originalMount(component, options);
};

window.mount = mount;
export { mount };
```

Example (`ProductCard.test.ts`):
```ts
import { mount as originalMount } from '@testing-library/vue';
const mount = (window as any).mount;
```

This workaround is necessary due to Vitest’s current module resolution limitations. It’s a pragmatic solution to enable centralized testing setup in Vue apps when ESM imports are unreliable.
