import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://globetotter-backend-production.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
