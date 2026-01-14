const { ObjectId } = require('mongodb');
const database = require('../config/database');
const { COLLECTIONS } = require('../utils/constants');
const { sanitizePenguinData } = require('../utils/helpers');

// Performance monitoring configuration
const SLOW_QUERY_THRESHOLD = 100; // ms

/**
 * Monitor database query performance
 * @param {string} operation - Operation name
 * @param {number} duration - Query duration in ms
 * @param {object} query - Query details
 */
const monitorQuery = (operation, duration, query = {}) => {
  if (duration > SLOW_QUERY_THRESHOLD) {
    console.warn(`⚠️  SLOW DB QUERY [${operation}]: ${duration}ms`, query);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`📊 DB QUERY [${operation}]: ${duration}ms`);
  }
};

class Penguin {
  constructor(data) {
    this.name = data.name;
    this.species = data.species;
    this.age = data.age || null;
    this.location = data.location || '';
    this.weight = data.weight || null;
    this.height = data.height || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get the penguins collection
  static getCollection() {
    const db = database.getDb();
    return db.collection(COLLECTIONS.PENGUINS);
  }

  // Create a new penguin
  static async create(penguinData) {
    const start = Date.now();
    const sanitizedData = sanitizePenguinData(penguinData);
    const penguin = new Penguin(sanitizedData);
    
    const collection = this.getCollection();
    const result = await collection.insertOne(penguin);
    
    monitorQuery('create', Date.now() - start, { name: penguin.name });
    
    return {
      ...penguin,
      _id: result.insertedId
    };
  }

  // Find all penguins
  static async findAll(query = {}, options = {}) {
    const start = Date.now();
    const collection = this.getCollection();
    const penguins = await collection.find(query, options).toArray();
    
    monitorQuery('findAll', Date.now() - start, { count: penguins.length });
    
    return penguins;
  }

  // Find penguin by ID
  static async findById(id) {
    const start = Date.now();
    const collection = this.getCollection();
    const penguin = await collection.findOne({ _id: new ObjectId(id) });
    
    monitorQuery('findById', Date.now() - start, { id });
    
    return penguin;
  }

  // Update penguin by ID
  static async updateById(id, updateData) {
    const start = Date.now();
    const sanitizedData = sanitizePenguinData(updateData);
    sanitizedData.updatedAt = new Date();
    delete sanitizedData.createdAt; // Don't update creation date
    
    const collection = this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: sanitizedData }
    );
    
    monitorQuery('updateById', Date.now() - start, { id });
    
    return result;
  }

  // Delete penguin by ID
  static async deleteById(id) {
    const start = Date.now();
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    monitorQuery('deleteById', Date.now() - start, { id });
    
    return result;
  }

  // Get penguin statistics
  static async getStats() {
    const start = Date.now();
    const collection = this.getCollection();
    
    const [count, latestPenguin] = await Promise.all([
      collection.countDocuments(),
      collection.findOne({}, { sort: { createdAt: -1 } })
    ]);
    
    monitorQuery('getStats', Date.now() - start);
    
    return {
      total_penguins: count,
      latest_penguin: latestPenguin ? latestPenguin.name : 'None',
      collection_name: COLLECTIONS.PENGUINS
    };
  }

  // Search penguins by name or species
  static async search(searchTerm) {
    const start = Date.now();
    const collection = this.getCollection();
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    
    const penguins = await collection.find({
      $or: [
        { name: regex },
        { species: regex }
      ]
    }).toArray();
    
    monitorQuery('search', Date.now() - start, { term: searchTerm, results: penguins.length });
    
    return penguins;
  }
}

module.exports = Penguin;