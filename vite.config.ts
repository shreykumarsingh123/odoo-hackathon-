import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// removed lovable-tagger plugin (branding) — no auto-tagging in dev

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy /api to backend during development to avoid CORS
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
