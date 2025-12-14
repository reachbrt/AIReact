import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@aireact/core': path.resolve(__dirname, '../packages/core/dist/index.js'),
      '@aireact/chatbot': path.resolve(__dirname, '../packages/chatbot/dist/index.js'),
      '@aireact/autosuggest': path.resolve(__dirname, '../packages/autosuggest/dist/index.js'),
      '@aireact/smartform': path.resolve(__dirname, '../packages/smartform/dist/index.js'),
      '@aireact/analytics': path.resolve(__dirname, '../packages/analytics/dist/index.js'),
    },
  },
  optimizeDeps: {
    include: ['@aireact/core', '@aireact/chatbot', '@aireact/autosuggest', '@aireact/smartform', '@aireact/analytics'],
  },
});

