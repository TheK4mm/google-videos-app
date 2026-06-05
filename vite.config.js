import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, requests to /api are proxied to the Express backend so the
// frontend can use relative URLs (no hardcoded host, no CORS issues).
// Override the target with VITE_DEV_API_TARGET if your backend runs elsewhere.
const API_TARGET = process.env.VITE_DEV_API_TARGET || "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
