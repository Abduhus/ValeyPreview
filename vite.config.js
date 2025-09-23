import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const getConditionalPlugins = () => {
    if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
        try {
            const cartographer = require("@replit/vite-plugin-cartographer").cartographer;
            return [cartographer()];
        }
        catch (error) {
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
            "@assets": path.resolve(__dirname, "client", "public", "assets"),
        },
    },
    root: path.resolve(__dirname, "client"),
    build: {
        outDir: path.resolve(__dirname, "dist", "public"),
        emptyOutDir: true,
    },
    server: {
        port: 5174,
        host: true,
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
    publicDir: path.resolve(__dirname, "client", "public"),
});
//# sourceMappingURL=vite.config.js.map