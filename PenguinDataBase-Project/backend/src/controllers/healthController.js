const database = require('../config/database');
const { MESSAGES, STATUS_CODES, COLLECTIONS } = require('../utils/constants');
const { createResponse } = require('../utils/helpers');

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
}

module.exports = HealthController;