// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    ROOT: '/',
    PENGUINS: '/api/penguins',
    STATS: '/api/penguins/stats'
  }
};

// Form field configurations
export const PENGUIN_FORM_FIELDS = {
  name: {
    type: 'text',
    placeholder: 'Penguin Name *',
    required: true
  },
  species: {
    type: 'text',
    placeholder: 'Species *',
    required: true
  },
  age: {
    type: 'number',
    placeholder: 'Age (years)',
    required: false
  },
  location: {
    type: 'text',
    placeholder: 'Location',
    required: false
  },
  weight: {
    type: 'number',
    placeholder: 'Weight (kg)',
    required: false,
    step: '0.1'
  },
  height: {
    type: 'number',
    placeholder: 'Height (cm)',
    required: false
  }
};

// Initial form state
export const INITIAL_FORM_DATA = {
  name: '',
  species: '',
  age: '',
  location: '',
  weight: '',
  height: ''
};

// UI Messages
export const MESSAGES = {
  NO_PENGUINS: 'No penguins in the database yet. Add one above! 🐧',
  LOADING_PENGUINS: 'Loading penguins...',
  DELETE_CONFIRMATION: 'Are you sure you want to delete this penguin?',
  ADD_SUCCESS: 'Penguin added successfully! 🐧',
  DELETE_SUCCESS: 'Penguin deleted successfully!',
  CONNECTION_ERROR: 'Unable to connect to backend. Make sure the server is running on port 5000.'
};

// Button Labels
export const BUTTON_LABELS = {
  ADD_PENGUIN: '🐧 Add Penguin',
  ADDING: 'Adding...',
  DELETE: 'Delete',
  DELETING: 'Deleting...'
};

// CSS Classes (for consistency)
export const CSS_CLASSES = {
  PENGUIN_CARD: 'penguin-card',
  FORM_ROW: 'form-row',
  DELETE_BTN: 'delete-btn',
  PENGUIN_GRID: 'penguin-grid'
};