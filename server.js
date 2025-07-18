#!/usr/bin/env node

/**
 * Main server entry point for the Artisan-Distributor Platform
 * 
 * This file serves as the entry point for the backend API server.
 * It imports and starts the Express application defined in app.js.
 */

// Load environment variables first
require('dotenv').config({ path: './Backend/.env' });

console.log('🔧 Environment check:');
console.log('- Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
console.log('- MongoDB URI:', process.env.MONGO_URI ? 'Present' : 'Missing');

const app = require('./Backend/app');
const { connectDualDB } = require('./Backend/db/connect');

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  
  // Connect to databases
  try {
    await connectDualDB();
    console.log('🗄️  Database connections established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = server;
