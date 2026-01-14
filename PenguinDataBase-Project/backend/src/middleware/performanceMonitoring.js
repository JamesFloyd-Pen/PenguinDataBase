/**
 * Performance Monitoring Middleware
 * Tracks request duration, memory usage, and identifies slow requests
 */

const { logPerformanceMetric } = require('../utils/helpers');

// Configuration
const SLOW_REQUEST_THRESHOLD = 1000; // ms
const VERY_SLOW_THRESHOLD = 3000; // ms

/**
 * Request performance monitoring middleware
 * Logs request duration and alerts on slow requests
 */
const requestPerformanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  // Capture original end function
  const originalEnd = res.end;

  // Override res.end to capture metrics
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const endMemory = process.memoryUsage();
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

    const metric = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`,
      userAgent: req.get('user-agent')?.substring(0, 50) || 'Unknown'
    };

    // Log based on severity
    if (duration > VERY_SLOW_THRESHOLD) {
      console.error('🚨 VERY SLOW REQUEST:', metric);
    } else if (duration > SLOW_REQUEST_THRESHOLD) {
      console.warn('⚠️  SLOW REQUEST:', metric);
    } else if (res.statusCode >= 400) {
      console.warn('❌ ERROR REQUEST:', metric);
    } else {
      logPerformanceMetric(metric);
    }

    // Call original end function
    originalEnd.apply(res, args);
  };

  next();
};

/**
 * Error rate tracker
 * Keeps track of error rates for monitoring
 */
class ErrorRateTracker {
  constructor(windowSize = 60000) { // 1 minute window
    this.errors = [];
    this.requests = [];
    this.windowSize = windowSize;
  }

  recordRequest(isError = false) {
    const now = Date.now();
    this.requests.push(now);
    if (isError) {
      this.errors.push(now);
    }
    this.cleanup();
  }

  cleanup() {
    const now = Date.now();
    const cutoff = now - this.windowSize;
    this.requests = this.requests.filter(time => time > cutoff);
    this.errors = this.errors.filter(time => time > cutoff);
  }

  getStats() {
    this.cleanup();
    return {
      totalRequests: this.requests.length,
      totalErrors: this.errors.length,
      errorRate: this.requests.length > 0 
        ? ((this.errors.length / this.requests.length) * 100).toFixed(2) + '%'
        : '0%',
      windowSize: `${this.windowSize / 1000}s`
    };
  }
}

const errorTracker = new ErrorRateTracker();

/**
 * Error rate monitoring middleware
 */
const errorRateMonitor = (req, res, next) => {
  const originalEnd = res.end;

  res.end = function(...args) {
    errorTracker.recordRequest(res.statusCode >= 400);
    originalEnd.apply(res, args);
  };

  next();
};

/**
 * Get current error rate statistics
 */
const getErrorRateStats = () => errorTracker.getStats();

module.exports = {
  requestPerformanceMonitor,
  errorRateMonitor,
  getErrorRateStats,
  SLOW_REQUEST_THRESHOLD,
  VERY_SLOW_THRESHOLD
};
