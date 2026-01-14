const database = require('../config/database');
const { MESSAGES, STATUS_CODES, COLLECTIONS } = require('../utils/constants');
const { createResponse, formatMemoryUsage, formatUptime } = require('../utils/helpers');
const { getErrorRateStats } = require('../middleware/performanceMonitoring');
const Penguin = require('../models/Penguin');

class HealthController {
  // GET / - Basic health check
  static async healthCheck(req, res) {
    const response = createResponse(true, MESSAGES.SERVER_RUNNING);
    res.status(STATUS_CODES.OK).json({ message: MESSAGES.SERVER_RUNNING });
  }

  // GET /api/test - API test endpoint
  static async apiTest(req, res) {
    const response = createResponse(true, MESSAGES.API_WORKING, {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    
    res.status(STATUS_CODES.OK).json({ 
      message: MESSAGES.API_WORKING, 
      timestamp: new Date().toISOString() 
    });
  }

  // GET /api/db-test - Database connection test
  static async databaseTest(req, res, next) {
    try {
      const testResult = await database.testConnection();
      
      if (testResult.connected) {
        const response = createResponse(true, MESSAGES.DB_CONNECTED, testResult);
        res.status(STATUS_CODES.OK).json({
          message: MESSAGES.DB_CONNECTED,
          database: testResult.database,
          mongodb_version: testResult.mongodb_version
        });
      } else {
        const response = createResponse(false, MESSAGES.DB_NOT_CONNECTED, null, testResult.error);
        res.status(STATUS_CODES.INTERNAL_ERROR).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  // GET /api/health/detailed - Detailed health and performance metrics
  static async detailedHealth(req, res, next) {
    try {
      const startTime = Date.now();
      
      // Gather all metrics
      const [dbTest, errorStats] = await Promise.all([
        database.testConnection().catch(err => ({ connected: false, error: err.message })),
        Promise.resolve(getErrorRateStats())
      ]);

      const health = {
        status: dbTest.connected ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: formatUptime(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        
        // System metrics
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          memory: formatMemoryUsage(process.memoryUsage()),
          cpuUsage: process.cpuUsage()
        },

        // Database status
        database: {
          connected: dbTest.connected,
          mongodb_version: dbTest.mongodb_version || 'N/A',
          database_name: dbTest.database || 'N/A'
        },

        // Performance metrics
        performance: {
          errorRate: errorStats,
          healthCheckDuration: `${Date.now() - startTime}ms`
        }
      };

      res.status(STATUS_CODES.OK).json(health);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/health/metrics - Performance metrics only
  static async getMetrics(req, res) {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: process.uptime(),
        formatted: formatUptime(process.uptime())
      },
      memory: formatMemoryUsage(process.memoryUsage()),
      errors: getErrorRateStats(),
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    res.status(STATUS_CODES.OK).json(metrics);
  }
}

module.exports = HealthController;