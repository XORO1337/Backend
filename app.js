const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/User_route');
const artisanRoutes = require('./routes/Artisan_route');
const distributorRoutes = require('./routes/Distributor_route');
const productRoutes = require('./routes/Products_route');
const orderRoutes = require('./routes/Order_route');
const rawMaterialRoutes = require('./routes/RawMaterial_route');
const materialRoutes = require('./routes/Material_route');
const inventoryRoutes = require('./routes/Inventory_route');

// Database connection
const connectDB = require('./db/connect');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/raw-material-orders', rawMaterialRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Artisan Management System API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      artisans: '/api/artisans',
      distributors: '/api/distributors',
      products: '/api/products',
      orders: '/api/orders',
      rawMaterialOrders: '/api/raw-material-orders',
      materials: '/api/materials',
      inventory: '/api/inventory',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artisan_management';

// Start server
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 API available at: http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
