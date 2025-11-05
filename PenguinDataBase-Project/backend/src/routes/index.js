const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./healthRoutes');
const penguinRoutes = require('./penguinRoutes');

// Health and test routes (root level)
router.use('/', healthRoutes);

// API routes
router.use('/api/penguins', penguinRoutes);

module.exports = router;