import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Grouping node_modules into vendor chunks
          if (id.includes('node_modules')) {
            // Group react-related libraries into a separate chunk for better caching
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react')) {
              return 'vendor-react';
            }
            // Group other large libraries into a general vendor chunk
            return 'vendor';
          }
        },
      },
    },
  },
});