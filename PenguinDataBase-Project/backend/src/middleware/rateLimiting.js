const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Configuration
 * Protects API from abuse and ensures fair resource usage
 */

// General API rate limiter - applies to all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for localhost in development
  skip: (req) => {
    if (process.env.NODE_ENV === 'development' && req.ip === '::1') {
      return false; // Don't skip - still apply limits even in development
    }
    return false;
  }
});

// Stricter rate limiter for write operations (POST, PUT, DELETE)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 write requests per minute
  message: {
    success: false,
    message: 'Too many write operations from this IP. Please slow down and try again.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
  skipFailedRequests: false // Count failed requests too
});

// Very strict limiter for penguin creation to prevent spam
const createPenguinLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 penguin creations per minute
  message: {
    success: false,
    message: 'You are creating penguins too quickly. Please wait before adding more.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Lenient limiter for read operations
const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 read requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please try again in a moment.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth/sensitive endpoint limiter (for future authentication endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only allow 5 failed login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful auth attempts
});

/**
 * Custom handler for when rate limit is exceeded
 */
const rateLimitExceededHandler = (req, res) => {
  console.warn(`⚠️  Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`);
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      ip: req.ip,
      path: req.url
    }
  });
};

module.exports = {
  generalLimiter,
  writeLimiter,
  readLimiter,
  createPenguinLimiter,
  authLimiter,
  rateLimitExceededHandler
};
