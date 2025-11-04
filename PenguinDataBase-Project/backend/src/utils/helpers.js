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

module.exports = {
  isValidObjectId,
  createResponse,
  logPenguinOperation,
  sanitizePenguinData
};