const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MESSAGES, STATUS_CODES, VALIDATION } = require('../utils/constants');
const { createResponse } = require('../utils/helpers');

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRE = '7d'; // Token expires in 7 days

class AuthController {
  // POST /api/auth/register - Register new user
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Validation
      const errors = [];

      if (!username || username.trim().length < VALIDATION.USER.USERNAME_MIN_LENGTH) {
        errors.push(`Username must be at least ${VALIDATION.USER.USERNAME_MIN_LENGTH} characters`);
      }
      if (username && username.length > VALIDATION.USER.USERNAME_MAX_LENGTH) {
        errors.push(`Username must be less than ${VALIDATION.USER.USERNAME_MAX_LENGTH} characters`);
      }

      if (!email || !VALIDATION.USER.EMAIL_REGEX.test(email)) {
        errors.push('Valid email is required');
      }

      if (!password || password.length < VALIDATION.USER.PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${VALIDATION.USER.PASSWORD_MIN_LENGTH} characters`);
      }

      if (errors.length > 0) {
        const response = createResponse(false, MESSAGES.VALIDATION_ERROR, null, { validationErrors: errors });
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      // Create user
      const user = await User.create({ username, email, password });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      const response = createResponse(true, MESSAGES.REGISTER_SUCCESS, {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      });

      res.status(STATUS_CODES.CREATED).json(response);
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        const response = createResponse(false, error.message, null);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }
      next(error);
    }
  }

  // POST /api/auth/login - Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        const response = createResponse(false, 'Email and password are required', null);
        return res.status(STATUS_CODES.BAD_REQUEST).json(response);
      }

      // Authenticate user
      const user = await User.authenticate(email, password);

      if (!user) {
        const response = createResponse(false, MESSAGES.INVALID_CREDENTIALS, null);
        return res.status(STATUS_CODES.UNAUTHORIZED).json(response);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      const response = createResponse(true, MESSAGES.LOGIN_SUCCESS, {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      });

      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me - Get current user (requires auth)
  static async getCurrentUser(req, res, next) {
    try {
      const Penguin = require('../models/Penguin');
      
      // User is already attached to req by auth middleware
      const user = await User.findById(req.user.userId);

      if (!user) {
        const response = createResponse(false, 'User not found', null);
        return res.status(STATUS_CODES.NOT_FOUND).json(response);
      }

      // Get penguin count for user
      const penguinCount = await Penguin.countByUser(req.user.userId);

      const response = createResponse(true, 'User retrieved successfully', { 
        user,
        penguinCount 
      });
      res.status(STATUS_CODES.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout - Logout user (client-side token removal)
  static async logout(req, res) {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint exists for consistency and can be extended for token blacklisting
    const response = createResponse(true, MESSAGES.LOGOUT_SUCCESS, null);
    res.status(STATUS_CODES.OK).json(response);
  }

  // GET /api/auth/verify - Verify token validity
  static async verifyToken(req, res) {
    // If this route is reached, the auth middleware already verified the token
    const response = createResponse(true, 'Token is valid', {
      user: {
        userId: req.user.userId,
        username: req.user.username,
        email: req.user.email
      }
    });
    res.status(STATUS_CODES.OK).json(response);
  }
}

module.exports = AuthController;
