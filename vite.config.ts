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
          // React and three.js get chunks of their own. Left alone, Rollup folds them
          // into the labs chunk, and every page (even the homepage) downloads all ten labs.
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run\/router|zustand)\//.test(id)) return 'core';
          // Vite's lazy-import helper must live in the core chunk too, or the labs chunk
          // that happens to hold it becomes a dependency of every page.
          if (id.includes('vite/preload-helper') || id.includes('commonjsHelpers')) return 'core';
          // Small shared stores (progress, UI preferences) are used by studio pages too.
          if (/\/src\/lib\/(store|uiStore|progression)\.ts$/.test(id)) return 'core';
          if (/node_modules\/three\//.test(id)) return 'three';
          // Studio pages need only their own small content module, not the course.
          if (id.includes('/src/content/kamitron/')) return undefined;
          if (id.includes('/src/content/')) return 'content';
          return undefined;
        },

      },
    },
  },
});
