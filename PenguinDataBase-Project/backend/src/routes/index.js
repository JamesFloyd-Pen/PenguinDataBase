const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./healthRoutes');
const penguinRoutes = require('./penguinRoutes');
const authRoutes = require('./authRoutes');

// Health and test routes (root level)
router.use('/', healthRoutes);

// API routes
router.use('/api/penguins', penguinRoutes);
router.use('/api/auth', authRoutes);

module.exports = router;