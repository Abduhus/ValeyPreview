// Render entry point for ValleyPreview Perfume E-commerce Platform
// This file ensures proper startup on Render platform using ES modules

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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
    
    // Run the server directly with tsx
    console.log('Running server directly with tsx...');
    const serverPath = path.join(process.cwd(), 'server', 'index.ts');
    
    if (!fs.existsSync(serverPath)) {
      console.error('Server file not found at:', serverPath);
      process.exit(1);
    }
    
    console.log('Server file found at:', serverPath);
    
    // Spawn the server process with tsx - use cross-platform approach
    const child = spawn('npx', ['tsx', serverPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: process.env.PORT,
        RENDER_ENV: 'true'
      },
      shell: true // Use shell to handle cross-platform execution
    });
    
    child.on('error', (error) => {
      console.error('Failed to start server process:', error);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      console.log('Server process exited with code:', code);
      process.exit(code || 0);
    });
    
    console.log('Server process started successfully');
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