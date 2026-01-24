# PenguinDataBase

## What is Penguin Database? 

Penguin Database is a full-stack web application that allows users to enter their unique penguins, visualize them on an interactive map, and serve as an open-source platform for penguin data and information.


## Key Features

- 🐧 **CRUD Operations** - Create, read, update, and delete penguin records
- 🗺️ **Interactive Mapping** - Visualize penguin locations using Leaflet
- 🔍 **Search Functionality** - Find penguins by name or species
- �️ **API Rate Limiting** - Protection against abuse with tiered rate limits
- �📊 **Performance Monitoring** - Real-time request and database query tracking
- 🏥 **Health Monitoring** - Comprehensive system health and metrics endpoints
- ✅ **Input Validation** - Robust data validation and sanitization
- 🧪 **Test Coverage** - Jest unit tests for models


## Technologies Used

### Frontend
- React 19 - UI framework
- React Router - Client-side routing
- Leaflet - Interactive mapping
- JavaScript (ES6+)
- CSS3

### Backend
- Node.js & Express - Server framework
- MongoDB - Database
- RESTful API design

### Architecture
- MVC Pattern
- React Context API for state management
- Performance monitoring middleware
- Error rate tracking
- Database query optimization

### AI Agent
- Github Copilot and Claude

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd PenguinDataBase-Project/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with auto-restart
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd PenguinDataBase-Project/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Demo

<p align="center">
  <img src="Demo/Screenshot-Home.png" alt="Home Page" width="400" height="250" />
  <img src="Demo/Edward the Penguin.png" alt="Penguin Details" width="400" height="250" />
  <img src="Demo/Penguin-Data-Map.png" alt="Interactive Map" width="400" height="250" />
  <img src="Demo/Penguin Database.png" alt="Database" width="400" height="250" />
</p>

