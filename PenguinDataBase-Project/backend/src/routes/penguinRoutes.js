const express = require('express');
const router = express.Router();
const PenguinController = require('../controllers/penguinController');
const { validatePenguin, validateObjectId } = require('../middleware/validation');
const { readLimiter, writeLimiter, createPenguinLimiter } = require('../middleware/rateLimiting');
const { authMiddleware } = require('../middleware/auth');

// All penguin routes now require authentication
// GET /api/penguins/stats - Must come before /:id route
router.get('/stats', authMiddleware, readLimiter, PenguinController.getStats);

// GET /api/penguins/search?q=term
router.get('/search', authMiddleware, readLimiter, PenguinController.searchPenguins);

// GET /api/penguins - Get all penguins for logged-in user
router.get('/', authMiddleware, readLimiter, PenguinController.getAllPenguins);

// GET /api/penguins/:id - Get single penguin (user's own)
router.get('/:id', authMiddleware, readLimiter, validateObjectId(), PenguinController.getPenguinById);

// POST /api/penguins - Create new penguin (tied to user)
router.post('/', authMiddleware, createPenguinLimiter, validatePenguin, PenguinController.createPenguin);

// PUT /api/penguins/:id - Update penguin (user's own)
router.put('/:id', authMiddleware, writeLimiter, validateObjectId(), validatePenguin, PenguinController.updatePenguin);

// DELETE /api/penguins/:id - Delete penguin (user's own)
router.delete('/:id', authMiddleware, writeLimiter, validateObjectId(), PenguinController.deletePenguin);

module.exports = router;