// Load environment variables first
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
//This is the port side.

// MongoDB connection
let db;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_app';
console.log('MongoDB URI:', mongoURI ? 'Atlas URI loaded' : 'Using localhost fallback');

const mongoClient = new MongoClient(mongoURI, {
  // SSL configuration to bypass certificate verification
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running! :3' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// MongoDB test route
app.get('/api/db-test', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    // Test database connection by getting server info
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();
    
    res.json({ 
      message: 'Database connection successful!', 
      database: db.databaseName,
      mongodb_version: serverStatus.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example CRUD routes for a "users" collection
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.collection('users').insertOne({ 
      name, 
      email, 
      createdAt: new Date() 
    });
    res.json({ message: 'User created', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Penguin API endpoints
app.get('/api/penguins', async (req, res) => {
  try {
    const penguins = await db.collection('penguin-data').find({}).toArray();
    console.log(`📊 Fetched ${penguins.length} penguins from database`);
    res.json(penguins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get penguin database stats
app.get('/api/penguins/stats', async (req, res) => {
  try {
    const count = await db.collection('penguin-data').countDocuments();
    const latestPenguin = await db.collection('penguin-data')
      .findOne({}, { sort: { createdAt: -1 } });
    
    res.json({
      total_penguins: count,
      latest_penguin: latestPenguin ? latestPenguin.name : 'None',
      collection_name: 'penguin-data'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/penguins', async (req, res) => {
  try {
    const { name, species, age, location, weight, height } = req.body;
    
    // Validate required fields
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required' });
    }
    
    const penguin = {
      name,
      species,
      age: age || null,
      location: location || '',
      weight: weight || null,
      height: height || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('penguin-data').insertOne(penguin);
    
    // Log to console for verification
    console.log('🐧 NEW PENGUIN ADDED:');
    console.log(`Name: ${penguin.name}`);
    console.log(`Species: ${penguin.species}`);
    console.log(`ID: ${result.insertedId}`);
    console.log('-------------------');
    
    res.json({ 
      message: 'Penguin added successfully! 🐧', 
      id: result.insertedId,
      penguin: { ...penguin, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/penguins/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('penguin-data').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Penguin not found' });
    }
    
    res.json({ message: 'Penguin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    db = mongoClient.db(); // This will use the database from your connection string
    console.log('Connected to MongoDB!');
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`MongoDB connected to: ${db.databaseName}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoClient.close();
  process.exit(0);
});

// Start the application
startServer();