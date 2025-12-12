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
      '@reactai/core': path.resolve(__dirname, '../packages/core/dist/index.js'),
      '@reactai/chatbot': path.resolve(__dirname, '../packages/chatbot/dist/index.js'),
      '@reactai/autosuggest': path.resolve(__dirname, '../packages/autosuggest/dist/index.js'),
      '@reactai/smartform': path.resolve(__dirname, '../packages/smartform/dist/index.js'),
      '@reactai/analytics': path.resolve(__dirname, '../packages/analytics/dist/index.js'),
    },
  },
  optimizeDeps: {
    include: ['@reactai/core', '@reactai/chatbot', '@reactai/autosuggest', '@reactai/smartform', '@reactai/analytics'],
  },
});

