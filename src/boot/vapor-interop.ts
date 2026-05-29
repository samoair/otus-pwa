// Vapor Mode interop — boot-файл.
// 1. Устанавливает vaporInteropPlugin (для рендеринга vapor-компонентов
//    внутри обычных VDOM-компонентов).
// 2. Патчит performance.measure — Vue 3.6 beta в dev-режиме
//    вызывает performance.measure с mark'ами, которые не всегда существуют
//    в Vapor renderEffect. Без патча — SyntaxError и падение рендера.
import { boot } from 'quasar/wrappers';
import { vaporInteropPlugin } from 'vue';

export default boot(({ app }) => {
  app.use(vaporInteropPlugin);

  // Патч: делает performance.measure безопасным для Vue Vapor beta
  const originalMeasure = performance.measure.bind(performance);
  performance.measure = function (name: string, startMark?: string | PerformanceMeasureOptions) {
    try {
      return originalMeasure(name, startMark as string);
    } catch {
      // Vue beta: mark может не существовать в Vapor renderEffect — игнорируем
      return undefined as unknown as PerformanceMeasure;
    }
  };
});
