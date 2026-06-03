import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/vue';
import { createPinia } from 'pinia';
import { setActivePinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import { Quasar } from 'quasar';
import { App } from 'vue';

// Mock localStorage
const mockStorage = {} as Record<string, string>;
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    },
    length: 0,
    key: (i: number) => {
      const keys = Object.keys(mockStorage);
      return keys[i] || null;
    },
  },
  configurable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
  configurable: true,
});

// Mock Vue Router — include named routes used by components under test
// so RouterLink resolution doesn't throw.
const mockRouter = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: 'product-detail', path: '/products/:id', component: { template: '<div />' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
  ],
});
mockRouter.push = () => {};
mockRouter.replace = () => {};

// Mock Quasar plugin
const mockQuasarPlugin = {
  install(app: App) {
    // Ensure app.config exists
    if (!app.config) {
      app.config = {};
    }
    if (!app.config.globalProperties) {
      app.config.globalProperties = {};
    }
    app.config.globalProperties.$q = {
      notify: () => {},
      loading: {
        show: () => {},
        hide: () => {},
      },
      dialog: {
        create: () => {},
      },
      screen: {
        width: 1024,
        height: 768,
        size: 'desktop',
      },
      platform: {
        is: {
          mobile: false,
          tablet: false,
          desktop: true,
        },
      },
    };
  },
};

// @testing-library/vue v8 exports render (not mount)
import { render as originalRender } from '@testing-library/vue';

// Quasar component stubs — render as standard HTML so Testing Library
// queries (getByRole, getByText) work correctly.
// Without stubs, <q-btn label="В корзину"> renders as an inert custom
// element with no accessible role or text content.
const quasarStubs: Record<string, any> = {
  QCard: { template: '<div><slot /></div>' },
  QCardSection: { template: '<div><slot /></div>' },
  QCardActions: { template: '<div><slot /></div>' },
  QBtn: {
    template: '<button>{{ label }}<slot /></button>',
    props: ['label', 'color', 'icon', 'flat', 'dense', 'type', 'loading'],
  },
  QImg: {
    template: '<div><slot /></div>',
    props: ['src', 'alt', 'fit', 'height'],
  },
  QBadge: {
    template: '<span><slot /></span>',
    props: ['color', 'outline'],
  },
  QSeparator: { template: '<hr />' },
  QRating: {
    template: '<div />',
    props: ['modelValue', 'readonly', 'size', 'color', 'icon', 'iconHalf'],
  },
  QIcon: {
    template: '<i />',
    props: ['name', 'size', 'color'],
  },
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to'],
  },
};

// Wrapper that injects mockRouter, mockQuasarPlugin, and Quasar stubs automatically.
// Exported as `mount` so test files can keep a familiar API.
const mount = (...args: any[]) => {
  const [component, options] = args;
  if (!options) {
    return originalRender(component, { global: { stubs: quasarStubs } });
  }
  if (!options.global) {
    options.global = {};
  }
  if (!options.global.plugins) {
    options.global.plugins = [];
  }
  if (!options.global.stubs) {
    options.global.stubs = {};
  }
  // Always inject mockRouter, mockQuasarPlugin, and Quasar stubs
  options.global.plugins.push(mockRouter);
  options.global.plugins.push(mockQuasarPlugin);
  Object.assign(options.global.stubs, quasarStubs);
  return originalRender(component, options);
};

// Export mount for direct import in test files
export { mount };

// Set up Pinia and Quasar for tests
beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);

  // Mock router on global Vue instance
  const app = { provide: () => {}, use: (plugin: any) => plugin.install(app) } as unknown as App;
  app.provide('router', mockRouter);
  app.use(mockQuasarPlugin);
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});