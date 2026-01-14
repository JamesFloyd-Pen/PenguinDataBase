const jwt = require('jsonwebtoken');
const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const { createResponse } = require('../utils/helpers');

// JWT Secret (should match authController)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Authentication middleware - Verify JWT token
 * Protects routes that require authentication
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = createResponse(false, MESSAGES.TOKEN_REQUIRED, null);
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      const response = createResponse(false, MESSAGES.TOKEN_INVALID, null);
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }
    
    if (error.name === 'TokenExpiredError') {
      const response = createResponse(false, 'Token expired - Please log in again', null);
      return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
    }

    const response = createResponse(false, MESSAGES.UNAUTHORIZED, null);
    res.status(STATUS_CODES.UNAUTHORIZED).json(response);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't reject if missing
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };
    }
  } catch (error) {
    // Silently fail - authentication is optional
  }
  
  next();
};

module.exports = {
  authMiddleware,
  optionalAuth
};
