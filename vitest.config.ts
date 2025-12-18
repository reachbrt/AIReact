import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@aireact/smart-notify': resolve(__dirname, 'packages/smart-notify/src/index.ts'),
      '@aireact/core': resolve(__dirname, 'packages/core/src/index.ts'),
    },
  },
});

