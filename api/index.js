// Vercel serverless function entry point for Express app
const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://your-vercel-domain.vercel.app',
    'http://localhost:5174',
    'http://localhost:5000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
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
    message: 'ValleyPreview Perfume E-commerce Platform is running'
  });
});

app.get('/render/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'vercel'
  });
});

// Import and register API routes
try {
  // Try to import the compiled routes
  const { registerRoutes } = require('../dist/server/routes.js');
  
  // Register routes without creating HTTP server
  const mockServer = {
    listen: () => {},
    on: () => {}
  };
  
  // Apply routes to the app
  registerRoutes(app).then(() => {
    console.log('Routes registered successfully');
  }).catch((error) => {
    console.error('Failed to register routes:', error);
  });
} catch (error) {
  console.error('Failed to import routes:', error);
  
  // Fallback API routes
  app.get('/api/products', (req, res) => {
    res.json({ message: 'API is running, but routes not loaded', error: error.message });
  });
}

// Catch-all for SPA routing
app.get('*', (req, res) => {
  // For non-API routes, serve the React app
  if (!req.path.startsWith('/api')) {
    res.status(200).json({
      message: 'ValleyPreview Perfume E-commerce Platform',
      status: 'ok',
      path: req.path,
      note: 'This is the API endpoint. Frontend should be served separately.'
    });
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Export the Express app as a Vercel serverless function
module.exports = app;