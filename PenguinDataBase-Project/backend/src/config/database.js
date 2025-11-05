const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_app';
      console.log('MongoDB URI:', mongoURI ? 'Atlas URI loaded' : 'Using localhost fallback');

      this.client = new MongoClient(mongoURI, {
        // SSL configuration to bypass certificate verification
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      });

      await this.client.connect();
      this.db = this.client.db(); // This will use the database from your connection string
      console.log('Connected to MongoDB!');
      console.log(`Database: ${this.db.databaseName}`);
      
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  // Test database connection
  async testConnection() {
    try {
      const admin = this.db.admin();
      const serverStatus = await admin.serverStatus();
      return {
        connected: true,
        database: this.db.databaseName,
        mongodb_version: serverStatus.version
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

// Create and export a single instance
const database = new Database();

module.exports = database;


/* My Notes*/
/*

The javascript classs to establish connection to the database
*/