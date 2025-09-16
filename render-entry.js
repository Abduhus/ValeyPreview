// Render entry point for ValleyPreview Perfume E-commerce Platform
// This file ensures proper startup on Render platform

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
    
    // Check if the built server file exists
    const fs = require('fs');
    const path = require('path');
    
    const serverPath = path.join(process.cwd(), 'dist', 'server', 'index.js');
    console.log('Looking for server file at:', serverPath);
    
    if (!fs.existsSync(serverPath)) {
      console.error('Server file not found at:', serverPath);
      console.log('Available files in dist/server:');
      try {
        const files = fs.readdirSync(path.join(process.cwd(), 'dist', 'server'));
        console.log(files);
      } catch (e) {
        console.log('dist/server directory does not exist');
      }
      process.exit(1);
    }
    
    console.log('Server file found, importing...');
    
    // Import and start the server
    require('./dist/server/index.js');
    
    console.log('Server module loaded successfully');
    console.log('Server should now be listening on port:', process.env.PORT);
    
  } catch (error) {
    console.error('Failed to start application:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();