const Penguin = require('../models/Penguin');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const { createResponse, logPenguinOperation } = require('../utils/helpers');
const { ObjectId } = require('mongodb');

class PenguinController {
  // GET /api/penguins - Get all penguins for logged-in user
  static async getAllPenguins(req, res, next) {
    try {
      // req.user is set by authMiddleware
      const userId = req.user.userId;
      const query = { userId: new ObjectId(userId) };
      
      const penguins = await Penguin.findAll(query);
      console.log(`📊 Fetched ${penguins.length} penguins for user ${req.user.username}`);
      
      res.status(STATUS_CODES.OK).json(penguins);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/stats - Get penguin statistics for logged-in user
  static async getStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const stats = await Penguin.getStats(userId);
      res.status(STATUS_CODES.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/search?q=term - Search penguins for logged-in user
  static async searchPenguins(req, res, next) {
    try {
      const { q } = req.query;
      const userId = req.user.userId;
      
      if (!q) {
        const response = createResponse(false, 'Search term is required', null, { parameter: 'q' });
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      const penguins = await Penguin.search(q, userId);
      const response = createResponse(true, `Found ${penguins.length} penguins matching "${q}"`, penguins);
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/penguins/:id - Get single penguin (must belong to user)
  static async getPenguinById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const penguin = await Penguin.findById(id);
      
      if (!penguin) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Check ownership
      if (penguin.userId && penguin.userId.toString() !== userId) {
        const response = createResponse(false, 'You do not have permission to access this penguin', null);
        return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
      }

      const response = createResponse(true, 'Penguin retrieved successfully', penguin);
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/penguins - Create new penguin (tied to logged-in user)
  static async createPenguin(req, res, next) {
    try {
      const userId = req.user.userId;
      
      // Add userId to penguin data
      const penguinData = {
        ...req.body,
        userId: new ObjectId(userId)
      };
      
      const penguin = await Penguin.create(penguinData);
      
      // Log the operation
      logPenguinOperation('NEW PENGUIN ADDED', penguin);
      console.log(`👤 Added by user: ${req.user.username}`);
      
      res.status(STATUS_CODES.CREATED).json({ 
        message: MESSAGES.PENGUIN_ADDED, 
        id: penguin._id,
        penguin: penguin
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/penguins/:id - Update penguin (must belong to user)
  static async updatePenguin(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      // Check if penguin exists and belongs to user
      const existingPenguin = await Penguin.findById(id);
      if (!existingPenguin) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Check ownership
      if (existingPenguin.userId && existingPenguin.userId.toString() !== userId) {
        const response = createResponse(false, 'You do not have permission to update this penguin', null);
        return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
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

  // DELETE /api/penguins/:id - Delete penguin (must belong to user)
  static async deletePenguin(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      // Check if penguin exists and belongs to user
      const existingPenguin = await Penguin.findById(id);
      if (!existingPenguin) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Check ownership
      if (existingPenguin.userId && existingPenguin.userId.toString() !== userId) {
        const response = createResponse(false, 'You do not have permission to delete this penguin', null);
        return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
      }

      const result = await Penguin.deleteById(id);
      
      if (result.deletedCount === 0) {
        const response = createResponse(false, MESSAGES.PENGUIN_NOT_FOUND, null, { id });
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      logPenguinOperation('PENGUIN DELETED', { _id: id, name: existingPenguin.name, species: existingPenguin.species });
      
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.PENGUIN_DELETED });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PenguinController;