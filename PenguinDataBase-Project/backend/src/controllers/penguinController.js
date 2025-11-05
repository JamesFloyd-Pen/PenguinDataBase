const Penguin = require('../models/Penguin');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const { createResponse, logPenguinOperation } = require('../utils/helpers');

class PenguinController {
  // GET /api/penguins - Get all penguins
  static async getAllPenguins(req, res, next) {
    try {
      const penguins = await Penguin.findAll();
      console.log(`📊 Fetched ${penguins.length} penguins from database`);
      
      const response = createResponse(true, 'Penguins retrieved successfully', penguins);
      res.status(STATUS_CODES.OK).json(penguins); // Keep original format for frontend compatibility
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/stats - Get penguin statistics
  static async getStats(req, res, next) {
    try {
      const stats = await Penguin.getStats();
      res.status(STATUS_CODES.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/search?q=term - Search penguins
  static async searchPenguins(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q) {
        const response = createResponse(false, 'Search term is required', null, { parameter: 'q' });
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      const penguins = await Penguin.search(q);
      const response = createResponse(true, `Found ${penguins.length} penguins matching "${q}"`, penguins);
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/:id - Get single penguin
  static async getPenguinById(req, res, next) {
    try {
      const { id } = req.params;
      const penguin = await Penguin.findById(id);
      
      if (!penguin) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      const response = createResponse(true, 'Penguin retrieved successfully', penguin);
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/penguins - Create new penguin
  static async createPenguin(req, res, next) {
    try {
      const penguin = await Penguin.create(req.body);
      
      // Log the operation
      logPenguinOperation('NEW PENGUIN ADDED', penguin);
      
      const response = createResponse(true, MESSAGES.PENGUIN_ADDED, penguin);
      
      // Keep original response format for frontend compatibility
      res.status(STATUS_CODES.CREATED).json({ 
        message: MESSAGES.PENGUIN_ADDED, 
        id: penguin._id,
        penguin: penguin
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/penguins/:id - Update penguin
  static async updatePenguin(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check if penguin exists first
      const existingPenguin = await Penguin.findById(id);
      if (!existingPenguin) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      const result = await Penguin.updateById(id, req.body);
      
      if (result.modifiedCount === 0) {
        const response = createResponse(false, 'No changes made to penguin', null, { id });
        return res.status(STATUS_CODES.OK).json(response);
      }

      const updatedPenguin = await Penguin.findById(id);
      logPenguinOperation('PENGUIN UPDATED', updatedPenguin);
      
      const response = createResponse(true, 'Penguin updated successfully', updatedPenguin);
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/penguins/:id - Delete penguin
  static async deletePenguin(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Penguin.deleteById(id);
      
      if (result.deletedCount === 0) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      logPenguinOperation('PENGUIN DELETED', { _id: id, name: 'Unknown', species: 'Unknown' });
      
      // Keep original response format for frontend compatibility
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.PENGUIN_DELETED });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PenguinController;