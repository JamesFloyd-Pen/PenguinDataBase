const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/healthController');

// Health check routes
router.get('/', HealthController.healthCheck);
router.get('/api/test', HealthController.apiTest);
router.get('/api/db-test', HealthController.databaseTest);

module.exports = router;