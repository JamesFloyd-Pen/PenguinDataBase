// Load environment variables first
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');

// Import configurations and utilities
const serverConfig = require('./src/config/server');
const database = require('./src/config/database');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const { requestPerformanceMonitor, errorRateMonitor } = require('./src/middleware/performanceMonitoring');

// Create Express application
const app = express();

// Middleware
app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Performance monitoring middleware
app.use(requestPerformanceMonitor);
app.use(errorRateMonitor);

// Request logging middleware (development only)
if (serverConfig.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB first
    await database.connect();
    
    // Start the Express server
    const server = app.listen(serverConfig.PORT, () => {
      console.log(`� Server is running on port ${serverConfig.PORT}`);
      console.log(`🌍 Environment: ${serverConfig.NODE_ENV}`);
      console.log(`📝 API Documentation: http://localhost:${serverConfig.PORT}/api/test`);
    });

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n� Received ${signal}. Shutting down gracefully...`);
  
  try {
    await database.disconnect();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the application
if (require.main === module) {
  startServer();
}

module.exports = app;