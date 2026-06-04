import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'src': resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['tests/unit/**/node_modules/**'],
    restoreMocks: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
    },
    setupFiles: ['tests/unit/setup.ts'],
  },
});