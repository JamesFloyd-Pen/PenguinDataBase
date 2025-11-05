const { ObjectId } = require('mongodb');
const database = require('../config/database');
const { COLLECTIONS } = require('../utils/constants');
const { sanitizePenguinData } = require('../utils/helpers');

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
    const sanitizedData = sanitizePenguinData(penguinData);
    const penguin = new Penguin(sanitizedData);
    
    const collection = this.getCollection();
    const result = await collection.insertOne(penguin);
    
    return {
      ...penguin,
      _id: result.insertedId
    };
  }

  // Find all penguins
  static async findAll(query = {}, options = {}) {
    const collection = this.getCollection();
    const penguins = await collection.find(query, options).toArray();
    return penguins;
  }

  // Find penguin by ID
  static async findById(id) {
    const collection = this.getCollection();
    const penguin = await collection.findOne({ _id: new ObjectId(id) });
    return penguin;
  }

  // Update penguin by ID
  static async updateById(id, updateData) {
    const sanitizedData = sanitizePenguinData(updateData);
    sanitizedData.updatedAt = new Date();
    delete sanitizedData.createdAt; // Don't update creation date
    
    const collection = this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: sanitizedData }
    );
    
    return result;
  }

  // Delete penguin by ID
  static async deleteById(id) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  // Get penguin statistics
  static async getStats() {
    const collection = this.getCollection();
    
    const [count, latestPenguin] = await Promise.all([
      collection.countDocuments(),
      collection.findOne({}, { sort: { createdAt: -1 } })
    ]);
    
    return {
      total_penguins: count,
      latest_penguin: latestPenguin ? latestPenguin.name : 'None',
      collection_name: COLLECTIONS.PENGUINS
    };
  }

  // Search penguins by name or species
  static async search(searchTerm) {
    const collection = this.getCollection();
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    
    const penguins = await collection.find({
      $or: [
        { name: regex },
        { species: regex }
      ]
    }).toArray();
    
    return penguins;
  }
}

module.exports = Penguin;