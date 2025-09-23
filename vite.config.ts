import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conditional plugin loading without top-level await
const getConditionalPlugins = () => {
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      // Dynamic import for cartographer plugin
      const cartographer = require("@replit/vite-plugin-cartographer").cartographer;
      return [cartographer()];
    } catch (error) {
      console.warn("Failed to load cartographer plugin:", error);
      return [];
    }
  }
  return [];
};

export default defineConfig({
  plugins: [
    react(),
    ...getConditionalPlugins()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "client", "public", "assets"),
    },
  },
  root: resolve(__dirname, "client"),
  build: {
    outDir: resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    host: true, // Changed from default to explicitly allow external connections
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  publicDir: resolve(__dirname, "client", "public"), // Fixed to point to client/public
});