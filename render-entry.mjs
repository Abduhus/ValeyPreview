// Render entry point for ValleyPreview Perfume E-commerce Platform
// This file ensures proper startup on Render platform using ES modules

import fs from 'fs';
import path from 'path';

console.log('=== ValleyPreview Perfume E-commerce Platform ===');
console.log('Environment:', process.env.NODE_ENV || 'production');
console.log('Port:', process.env.PORT || '10000');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
async function startServer() {
  try {
    console.log('Starting production server...');
    
    // Set environment variables
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env.PORT = process.env.PORT || '10000';
    process.env.RENDER_ENV = 'true'; // Explicitly set Render environment
    
    // Try to find the server entry point
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'server', 'server', 'index.js'),
      path.join(process.cwd(), 'dist', 'server', 'index.js'),
      path.join(process.cwd(), 'server', 'index.js')
    ];
    
    let serverPath = null;
    for (const possiblePath of possiblePaths) {
      console.log('Checking for server file at:', possiblePath);
      if (fs.existsSync(possiblePath)) {
        serverPath = possiblePath;
        console.log('Server file found at:', serverPath);
        break;
      }
    }
    
    if (!serverPath) {
      console.error('Server file not found in any of the expected locations');
      console.log('Available files in dist/:');
      try {
        const distFiles = fs.readdirSync(path.join(process.cwd(), 'dist'));
        console.log(distFiles);
      } catch (e) {
        console.log('dist/ directory does not exist');
      }
      
      console.log('Available files in dist/server/:');
      try {
        const distServerFiles = fs.readdirSync(path.join(process.cwd(), 'dist', 'server'));
        console.log(distServerFiles);
      } catch (e) {
        console.log('dist/server/ directory does not exist');
      }
      
      console.log('Available files in server/:');
      try {
        const serverFiles = fs.readdirSync(path.join(process.cwd(), 'server'));
        console.log(serverFiles);
      } catch (e) {
        console.log('server/ directory does not exist');
      }
      
      // If we can't find the compiled server, try to run directly with tsx
      console.log('Attempting to run server directly with tsx...');
      serverPath = path.join(process.cwd(), 'server', 'index.ts');
      if (fs.existsSync(serverPath)) {
        console.log('Found TypeScript server file, will run with tsx');
        // We'll need tsx to run TypeScript directly
        try {
          await import('tsx');
          console.log('tsx is available, proceeding...');
        } catch (e) {
          console.error('tsx is not available, cannot run TypeScript server directly');
          process.exit(1);
        }
      } else {
        console.error('TypeScript server file not found at:', serverPath);
        process.exit(1);
      }
    }
    
    console.log('Server file found, importing...');
    
    // Import and start the server
    await import(serverPath);
    
    console.log('Server module loaded successfully');
    console.log('Server should now be listening on port:', process.env.PORT);
    
    // Additional Render-specific logging
    console.log('🚀 RENDER DEPLOYMENT: Application started successfully');
    console.log('🚀 RENDER DEPLOYMENT: Listening on port', process.env.PORT);
    
  } catch (error) {
    console.error('Failed to start application:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();

// Keep the process alive
setInterval(() => {
  if (process.env.RENDER_ENV === 'true') {
    console.log('🚀 RENDER DEPLOYMENT: Heartbeat - Application is still running');
  }
}, 60000); // Log every minute to keep Render aware that the app is alive