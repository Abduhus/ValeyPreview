import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Import vite config dynamically to avoid issues in production
  const { default: viteConfig } = await import("../vite.config.js");

  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit on Vite errors in development
        console.error("Vite error (non-fatal in dev):", msg);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  // Serve static assets from client/public during development
  app.use('/assets', express.static(path.resolve(process.cwd(), 'client', 'public', 'assets')));
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use path.resolve with process.cwd() for better compatibility
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, files are built to dist/public
  // Use process.cwd() for better compatibility
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.warn(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
    // Fallback to serving from client directory in development
    const clientPath = path.resolve(process.cwd(), "client");
    if (fs.existsSync(clientPath)) {
      console.log("Serving from client directory as fallback");
      app.use(express.static(clientPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(clientPath, "index.html"));
      });
      return;
    }
    
    // If no directories found, send a simple error response
    app.use("*", (_req, res) => {
      res.status(500).send("Application not built yet. Run 'npm run build' first.");
    });
    return;
  }

  // Serve static files from dist/public
  app.use(express.static(distPath));
  
  // Serve assets specifically from the assets subdirectory
  app.use('/assets', express.static(path.resolve(distPath, 'assets')));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}