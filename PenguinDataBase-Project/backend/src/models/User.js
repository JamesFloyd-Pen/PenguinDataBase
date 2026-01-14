const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const database = require('../config/database');
const { COLLECTIONS } = require('../utils/constants');

class User {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password; // Will be hashed
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get the users collection
  static getCollection() {
    const db = database.getDb();
    return db.collection(COLLECTIONS.USERS);
  }

  // Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Compare password with hash
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Create a new user
  static async create(userData) {
    const start = Date.now();
    
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    const user = new User({
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const collection = this.getCollection();
    const result = await collection.insertOne(user);
    
    console.log(`🔐 New user registered: ${user.username} (${Date.now() - start}ms)`);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      _id: result.insertedId
    };
  }

  // Find user by email
  static async findByEmail(email) {
    const collection = this.getCollection();
    return await collection.findOne({ email: email.toLowerCase() });
  }

  // Find user by username
  static async findByUsername(username) {
    const collection = this.getCollection();
    return await collection.findOne({ username: username });
  }

  // Find user by ID
  static async findById(id) {
    const collection = this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    
    if (user) {
      // Remove password from returned user
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  // Authenticate user
  static async authenticate(email, password) {
    const start = Date.now();
    const user = await this.findByEmail(email);
    
    if (!user) {
      console.warn(`❌ Failed login attempt: ${email} (user not found)`);
      return null;
    }

    const isMatch = await this.comparePassword(password, user.password);
    
    if (!isMatch) {
      console.warn(`❌ Failed login attempt: ${email} (invalid password)`);
      return null;
    }

    console.log(`✅ User authenticated: ${user.username} (${Date.now() - start}ms)`);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user count
  static async count() {
    const collection = this.getCollection();
    return await collection.countDocuments();
  }

  // Update user
  static async updateById(id, updateData) {
    const collection = this.getCollection();
    
    // Don't allow direct password updates through this method
    delete updateData.password;
    delete updateData.email; // Email shouldn't be changed easily
    
    updateData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return result;
  }

  // Delete user
  static async deleteById(id) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }
}

module.exports = User;
