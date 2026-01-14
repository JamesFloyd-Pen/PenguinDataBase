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
  
  // Auth messages
  REGISTER_SUCCESS: 'User registered successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized - Please log in',
  TOKEN_REQUIRED: 'Access token required',
  TOKEN_INVALID: 'Invalid or expired token',
  
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
  UNAUTHORIZED: 401,
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
  },
  USER: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

module.exports = {
  MESSAGES,
  COLLECTIONS,
  STATUS_CODES,
  VALIDATION
};