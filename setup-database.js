#!/usr/bin/env node

/**
 * Database Setup Script for ValleyPreview
 * This script helps set up the database schema and initial data
 */

const { getDatabase } = require('./server/db.js');
const { products, users, cartItems } = require('./shared/schema.js');

async function setupDatabase() {
  console.log('🗄️  Setting up ValleyPreview database...');
  
  const db = getDatabase();
  
  if (!db) {
    console.log('❌ No database connection available.');
    console.log('💡 To use a database, set the DATABASE_URL environment variable.');
    console.log('💡 Example: DATABASE_URL=postgresql://user:pass@host:port/database');
    console.log('💡 The application will work fine with in-memory storage for testing.');
    return;
  }

  try {
    console.log('✅ Database connection established');
    
    // Note: In a real setup, you would run migrations here
    // For now, we'll just verify the connection works
    
    console.log('🔍 Testing database operations...');
    
    // Test a simple query to verify the connection
    const testQuery = await db.select().from(products).limit(1);
    console.log('✅ Database query test successful');
    
    console.log('🎉 Database setup complete!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run database migrations: npm run db:push');
    console.log('2. Seed initial data if needed');
    console.log('3. Start the application: npm run start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Verify DATABASE_URL is correct');
    console.log('2. Ensure database server is running');
    console.log('3. Check network connectivity');
    console.log('4. Verify database permissions');
    console.log('');
    console.log('💡 The application will fall back to in-memory storage if database is unavailable.');
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };