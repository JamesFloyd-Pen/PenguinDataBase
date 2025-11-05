const { VALIDATION, MESSAGES, STATUS_CODES } = require('../utils/constants');
const { createResponse } = require('../utils/helpers');

/**
 * Validate penguin data for creation/update
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
const validatePenguin = (req, res, next) => {
  const { name, species, age, weight, height } = req.body;
  const errors = [];

  // Required fields
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > VALIDATION.PENGUIN.NAME_MAX_LENGTH) {
    errors.push(`Name must be less than ${VALIDATION.PENGUIN.NAME_MAX_LENGTH} characters`);
  }

  if (!species || species.trim().length === 0) {
    errors.push('Species is required');
  } else if (species.trim().length > VALIDATION.PENGUIN.SPECIES_MAX_LENGTH) {
    errors.push(`Species must be less than ${VALIDATION.PENGUIN.SPECIES_MAX_LENGTH} characters`);
  }

  // Optional fields validation
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < VALIDATION.PENGUIN.AGE_MIN || ageNum > VALIDATION.PENGUIN.AGE_MAX) {
      errors.push(`Age must be between ${VALIDATION.PENGUIN.AGE_MIN} and ${VALIDATION.PENGUIN.AGE_MAX}`);
    }
  }

  if (weight !== undefined && weight !== null && weight !== '') {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum < VALIDATION.PENGUIN.WEIGHT_MIN || weightNum > VALIDATION.PENGUIN.WEIGHT_MAX) {
      errors.push(`Weight must be between ${VALIDATION.PENGUIN.WEIGHT_MIN} and ${VALIDATION.PENGUIN.WEIGHT_MAX} kg`);
    }
  }

  if (height !== undefined && height !== null && height !== '') {
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum < VALIDATION.PENGUIN.HEIGHT_MIN || heightNum > VALIDATION.PENGUIN.HEIGHT_MAX) {
      errors.push(`Height must be between ${VALIDATION.PENGUIN.HEIGHT_MIN} and ${VALIDATION.PENGUIN.HEIGHT_MAX} cm`);
    }
  }

  if (errors.length > 0) {
    const response = createResponse(false, MESSAGES.VALIDATION_ERROR, null, { validationErrors: errors });
    return res.status(STATUS_CODES.BAD_REQUEST).json(response);
  }

  next();
};

/**
 * Validate MongoDB ObjectId parameter
 * @param {string} paramName - Name of the parameter to validate
 * @returns {Function} - Express middleware function
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const { ObjectId } = require('mongodb');
    const id = req.params[paramName];

    if (!ObjectId.isValid(id)) {
      const response = createResponse(false, 'Invalid ID format', null, { invalidId: id });
      return res.status(STATUS_CODES.BAD_REQUEST).json(response);
    }

    next();
  };
};

module.exports = {
  validatePenguin,
  validateObjectId
};