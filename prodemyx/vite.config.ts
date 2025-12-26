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
          if (id.includes("node_modules")) {
            const module = id.split("node_modules/").pop()?.split("/")[0];
            if (module === "react" || module === "react-dom" || module === "react-router-dom") {
              return "vendor-react";
            }
            if (module === "swiper" || module === "gsap") {
              return "vendor-animation";
            }
            return "vendor-main";
          }
        },
      },
    },
  },
});