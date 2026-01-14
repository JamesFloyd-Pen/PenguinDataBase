const express = require('express');
const router = express.Router();
const PenguinController = require('../controllers/penguinController');
const { validatePenguin, validateObjectId } = require('../middleware/validation');
const { readLimiter, writeLimiter, createPenguinLimiter } = require('../middleware/rateLimiting');

// GET /api/penguins/stats - Must come before /:id route
router.get('/stats', readLimiter, PenguinController.getStats);

// GET /api/penguins/search?q=term
router.get('/search', readLimiter, PenguinController.searchPenguins);

// GET /api/penguins - Get all penguins
router.get('/', readLimiter, PenguinController.getAllPenguins);

// GET /api/penguins/:id - Get single penguin
router.get('/:id', readLimiter, validateObjectId(), PenguinController.getPenguinById);

// POST /api/penguins - Create new penguin (strictest limits)
router.post('/', createPenguinLimiter, validatePenguin, PenguinController.createPenguin);

// PUT /api/penguins/:id - Update penguin
router.put('/:id', writeLimiter, validateObjectId(), validatePenguin, PenguinController.updatePenguin);

// DELETE /api/penguins/:id - Delete penguin
router.delete('/:id', writeLimiter, validateObjectId(), PenguinController.deletePenguin);

module.exports = router;