const express = require('express');
const router = express.Router();
const PenguinController = require('../controllers/penguinController');
const { validatePenguin, validateObjectId } = require('../middleware/validation');

// GET /api/penguins/stats - Must come before /:id route
router.get('/stats', PenguinController.getStats);

// GET /api/penguins/search?q=term
router.get('/search', PenguinController.searchPenguins);

// GET /api/penguins - Get all penguins
router.get('/', PenguinController.getAllPenguins);

// GET /api/penguins/:id - Get single penguin
router.get('/:id', validateObjectId(), PenguinController.getPenguinById);

// POST /api/penguins - Create new penguin
router.post('/', validatePenguin, PenguinController.createPenguin);

// PUT /api/penguins/:id - Update penguin
router.put('/:id', validateObjectId(), validatePenguin, PenguinController.updatePenguin);

// DELETE /api/penguins/:id - Delete penguin
router.delete('/:id', validateObjectId(), PenguinController.deletePenguin);

module.exports = router;