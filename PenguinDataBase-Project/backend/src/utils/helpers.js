const { ObjectId } = require('mongodb');

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
};

/**
 * Create a standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {*} data - Response data (optional)
 * @param {*} error - Error details (optional)
 * @returns {object} - Standardized response object
 */
const createResponse = (success, message, data = null, error = null) => {
  const response = { success, message };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (error !== null) {
    response.error = error;
  }
  
  response.timestamp = new Date().toISOString();
  
  return response;
};

/**
 * Log penguin operations to console
 * @param {string} operation - Type of operation (ADD, DELETE, UPDATE, etc.)
 * @param {object} penguin - Penguin data
 */
const logPenguinOperation = (operation, penguin) => {
  console.log(`🐧 ${operation}:`);
  console.log(`Name: ${penguin.name}`);
  console.log(`Species: ${penguin.species}`);
  if (penguin._id) console.log(`ID: ${penguin._id}`);
  console.log('-------------------');
};

/**
 * Sanitize penguin data before saving to database
 * @param {object} data - Raw penguin data
 * @returns {object} - Sanitized penguin data
 */
const sanitizePenguinData = (data) => {
  return {
    name: data.name?.trim(),
    species: data.species?.trim(),
    age: data.age ? parseInt(data.age) : null,
    location: data.location?.trim() || '',
    weight: data.weight ? parseFloat(data.weight) : null,
    height: data.height ? parseFloat(data.height) : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Log performance metrics in a clean format
 * @param {object} metric - Performance metric data
 */
const logPerformanceMetric = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 ${metric.method} ${metric.url} - ${metric.statusCode} - ${metric.duration}`);
  }
};

/**
 * Format memory usage for display
 * @param {object} memoryUsage - process.memoryUsage() output
 * @returns {object} - Formatted memory usage in MB
 */
const formatMemoryUsage = (memoryUsage) => {
  return {
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
  };
};

/**
 * Calculate uptime in human-readable format
 * @param {number} seconds - Uptime in seconds
 * @returns {string} - Formatted uptime
 */
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
};

module.exports = {
  isValidObjectId,
  createResponse,
  logPenguinOperation,
  sanitizePenguinData,
  logPerformanceMetric,
  formatMemoryUsage,
  formatUptime
};