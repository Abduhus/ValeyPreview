// Render entry point for ValleyPreview Perfume E-commerce Platform
// This file ensures proper startup on Render platform

console.log('=== ValleyPreview Perfume E-commerce Platform ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || '10000');

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

// Start the application directly
try {
  console.log('Starting production server...');
  
  // Set environment variables
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  
  // Import and start the server directly
  import('./dist/server/index.cjs').catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}