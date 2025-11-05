const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/healthController');

// Health check routes
router.get('/', HealthController.healthCheck);
router.get('/api/test', HealthController.apiTest);
router.get('/api/db-test', HealthController.databaseTest);

module.exports = router;

/* --- Notes ---

- This file defines health check routes for the application.
- It includes three main endpoints:
  1. GET / - Basic health check to confirm the server is running.
  2. GET /api/test - Test endpoint to verify API functionality.
  3. GET /api/db-test - Test endpoint to verify database connectivity.

  This file serves as a basic health check for the application, ensuring that the API and database are functioning as expected.

  The health check routes can be used to monitor the status of the application and its dependencies.

  

*/