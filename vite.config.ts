import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (id.includes('/src/content/')) return 'content';
            if (id.includes('/src/components/labs/')) return 'labs';
            return undefined;
          }
          if (id.includes('/three/') || id.includes('@react-three')) return 'three';
          if (id.includes('recharts') || id.includes('/d3-')) return 'charts';
          if (id.includes('katex')) return 'katex';
          if (id.includes('framer-motion')) return 'motion';
          return 'vendor';
        },
      },
    },
  },
});
