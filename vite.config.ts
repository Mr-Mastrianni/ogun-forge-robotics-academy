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
          // Only group our own heavy source trees. Let Rollup decide node_modules
          // chunking from the real import graph: hand-grouping three.js and its
          // ecosystem into one chunk creates a three <-> vendor cycle.
          if (id.includes('/src/content/')) return 'content';
          if (id.includes('/src/components/labs/')) return 'labs';
          return undefined;
        },

      },
    },
  },
});
