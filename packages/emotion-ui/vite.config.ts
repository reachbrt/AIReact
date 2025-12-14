import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactAIEmotionUI',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@aireact/core'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM', '@aireact/core': 'ReactAICore' },
        assetFileNames: 'emotion-ui.[ext]',
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});

