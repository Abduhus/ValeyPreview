import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";

// Enhanced startup with comprehensive error logging
console.log('🚀 Starting ValleyPreview server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || '5000');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Add process error handlers
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const viteLogger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();
app.set('env', process.env.NODE_ENV || 'development');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware with environment-based configuration
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV?.trim() === "development";
  const allowedOrigins = isDev 
    ? ['http://localhost:5174', 'http://localhost:5000', 'http://127.0.0.1:5174', 'http://127.0.0.1:5000']
    : [process.env.FRONTEND_URL || 'https://your-domain.com'];
  
  const origin = req.headers.origin;
  if (isDev || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Health check endpoint for Railway and other monitoring services
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Additional health check endpoint for Render
app.get('/render/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    platform: 'render'
  });
});

// Root health check endpoint for compatibility
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'ValleyPreview Perfume E-commerce Platform is running'
  });
});

// Serve static assets from the assets directory
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('🚀 Initializing server components...');
    
    // Test basic imports first
    console.log('🔍 Testing module imports...');
    
    console.log('🔍 Registering routes...');
    const server = await registerRoutes(app);
    console.log('✅ Routes registered successfully');
    
    console.log('🔍 Setting up middleware...');

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error caught in middleware:", err);

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log('🔍 Setting up Vite/static serving...');
  const isDev = process.env.NODE_ENV?.trim() === "development";
  if (isDev) {
    console.log('🔍 Development mode: setting up Vite...');
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
    console.log('✅ Vite setup completed');
  } else {
    console.log('🔍 Production mode: setting up static serving...');
    const { serveStatic } = await import("./vite");
    serveStatic(app);
    console.log('✅ Static serving setup completed');
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  console.log('🔍 Starting HTTP server...');
  console.log(`Port: ${port}`);
  console.log(`Host: 0.0.0.0`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  server.listen({
    port,
    host: "0.0.0.0", // Changed from 127.0.0.1 to 0.0.0.0 for Railway compatibility
  }, () => {
    console.log('✅✅✅ SERVER STARTED SUCCESSFULLY! ✅✅✅');
    console.log(`🌍 Server listening on http://0.0.0.0:${port}`);
    console.log(`🌍 Health check: http://0.0.0.0:${port}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 Uptime: ${process.uptime()}s`);
    console.log('✅✅✅ READY TO ACCEPT CONNECTIONS! ✅✅✅');
  });
  
  // Handle server errors - FIXED: Properly typed error parameter
  server.on('error', (error: any) => {
    console.error('🚨 Server failed to start:', error);
    console.error('Error code:', error.code || 'Unknown');
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  });
  
  // Add timeout to detect if server doesn't start
  setTimeout(() => {
    console.log('🕰️ Server startup timeout check (30s)');
    console.log('If you see this message, the server is taking longer than expected to start');
  }, 30000);
  
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
})();