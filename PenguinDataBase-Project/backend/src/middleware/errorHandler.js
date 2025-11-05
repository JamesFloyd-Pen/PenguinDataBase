const { MESSAGES, STATUS_CODES } = require('../utils/constants');
const { createResponse } = require('../utils/helpers');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || STATUS_CODES.INTERNAL_ERROR;
  let message = err.message || MESSAGES.INTERNAL_ERROR;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = STATUS_CODES.BAD_REQUEST;
    message = MESSAGES.VALIDATION_ERROR;
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    statusCode = STATUS_CODES.INTERNAL_ERROR;
    message = 'Database operation failed';
  }

  const response = createResponse(false, message, null, {
    type: err.name,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors for undefined routes
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const notFoundHandler = (req, res) => {
  const response = createResponse(
    false, 
    `Route ${req.method} ${req.url} not found`, 
    null, 
    { statusCode: STATUS_CODES.NOT_FOUND }
  );
  
  res.status(STATUS_CODES.NOT_FOUND).json(response);
};

module.exports = {
  errorHandler,
  notFoundHandler
};