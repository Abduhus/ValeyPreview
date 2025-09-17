import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  publicDir: path.resolve(__dirname, "assets"),
});