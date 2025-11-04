// API Response Messages
const MESSAGES = {
  SERVER_RUNNING: 'Backend server is running! :3',
  API_WORKING: 'API is working!',
  DB_CONNECTED: 'Database connection successful!',
  DB_NOT_CONNECTED: 'Database not connected',
  
  // Penguin messages
  PENGUIN_ADDED: 'Penguin added successfully! 🐧',
  PENGUIN_DELETED: 'Penguin deleted successfully',
  PENGUIN_NOT_FOUND: 'Penguin not found',
  PENGUIN_REQUIRED_FIELDS: 'Name and species are required',
  
  // User messages
  USER_CREATED: 'User created',
  
  // Error messages
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error'
};

// Database collections
const COLLECTIONS = {
  PENGUINS: 'penguin-data',
  USERS: 'users'
};

// HTTP Status Codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// Validation rules
const VALIDATION = {
  PENGUIN: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    SPECIES_MIN_LENGTH: 1,
    SPECIES_MAX_LENGTH: 50,
    AGE_MIN: 0,
    AGE_MAX: 50,
    WEIGHT_MIN: 0,
    WEIGHT_MAX: 50,
    HEIGHT_MIN: 0,
    HEIGHT_MAX: 150
  }
};

module.exports = {
  MESSAGES,
  COLLECTIONS,
  STATUS_CODES,
  VALIDATION
};