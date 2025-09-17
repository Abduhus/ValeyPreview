// Render-specific server entry point
// This file is optimized for Render deployment

const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting ValleyPreview server for Render...');
console.log('Environment:', process.env.NODE_ENV || 'production');
console.log('Port:', process.env.PORT || '10000');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'render',
    message: 'ValleyPreview Perfume E-commerce Platform is running'
  });
});

app.get('/render/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'render'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    message: 'ValleyPreview Perfume E-commerce Platform is running on Render',
    endpoints: {
      health: '/health',
      api: '/api/*',
      assets: '/assets/*'
    }
  });
});

// Serve static assets
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

// Try to load the compiled routes
try {
  console.log('🔍 Loading compiled routes...');
  
  // Check if the routes file exists
  const routesPath = path.join(process.cwd(), 'dist', 'server', 'routes.js');
  if (fs.existsSync(routesPath)) {
    console.log('✅ Routes file found, loading...');
    const { registerRoutes } = require('./dist/server/routes.js');
    
    // Create a mock server object for route registration
    const mockServer = {
      listen: () => {},
      on: () => {}
    };
    
    // Register routes
    registerRoutes(app).then(() => {
      console.log('✅ Routes registered successfully');
    }).catch((error) => {
      console.error('❌ Failed to register routes:', error);
    });
  } else {
    console.log('⚠️ Routes file not found, using fallback API');
    
    // Fallback API routes
    app.get('/api/products', (req, res) => {
      res.json({ 
        message: 'API is running but routes not fully loaded',
        status: 'partial',
        note: 'This is a fallback response'
      });
    });
    
    app.get('/api/*', (req, res) => {
      res.status(404).json({ 
        message: 'API endpoint not found',
        path: req.path,
        note: 'Routes may not be fully loaded'
      });
    });
  }
} catch (error) {
  console.error('❌ Failed to load routes:', error);
  
  // Fallback API
  app.get('/api/*', (req, res) => {
    res.status(500).json({ 
      message: 'API temporarily unavailable',
      error: error.message,
      path: req.path
    });
  });
}

// Try to serve static files
try {
  const publicPath = path.join(process.cwd(), 'dist', 'public');
  if (fs.existsSync(publicPath)) {
    console.log('✅ Static files directory found, serving from:', publicPath);
    app.use(express.static(publicPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      const indexPath = path.join(publicPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({
          message: 'Frontend not available',
          note: 'index.html not found',
          path: req.path
        });
      }
    });
  } else {
    console.log('⚠️ Static files directory not found, serving API only');
    
    // Fallback for non-API routes
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.status(200).json({
          message: 'ValleyPreview Perfume E-commerce Platform',
          status: 'api-only',
          note: 'Frontend build not available',
          availableEndpoints: ['/health', '/api/products']
        });
      } else {
        res.status(404).json({ message: 'API endpoint not found' });
      }
    });
  }
} catch (error) {
  console.error('❌ Failed to set up static serving:', error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start server
const port = parseInt(process.env.PORT || '10000', 10);
const host = '0.0.0.0';

console.log(`🔍 Starting HTTP server on ${host}:${port}...`);

const server = app.listen(port, host, () => {
  console.log('✅✅✅ SERVER STARTED SUCCESSFULLY! ✅✅✅');
  console.log(`🌍 Server listening on http://${host}:${port}`);
  console.log(`🌍 Health check: http://${host}:${port}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🌍 Platform: Render`);
  console.log('✅✅✅ READY TO ACCEPT CONNECTIONS! ✅✅✅');
});

// Handle server errors
server.on('error', (error) => {
  console.error('🚨 Server failed to start:', error);
  console.error('Error code:', error.code || 'Unknown');
  console.error('Error message:', error.message);
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  process.exit(1);
});

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('🎯 Server setup complete, waiting for connections...');