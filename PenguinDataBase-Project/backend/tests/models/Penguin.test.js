const { MongoClient, ObjectId } = require('mongodb');
const Penguin = require('../../src/models/Penguin');
const database = require('../../src/config/database');

// Mock database configuration
jest.mock('../../src/config/database');

describe('Penguin Model', () => {
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    // Setup mock collection with common MongoDB methods
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    // Setup mock database
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // Mock the database.getDb() method
    database.getDb = jest.fn().mockReturnValue(mockDb);

    // Setup find to return a mock cursor
    mockCollection.find.mockReturnValue({
      toArray: jest.fn(),
      sort: jest.fn().mockReturnThis(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Penguin Constructor', () => {
    test('should create a penguin with all fields', () => {
      const data = {
        name: 'Happy Feet',
        species: 'Emperor',
        age: 5,
        location: 'Antarctica',
        weight: 25,
        height: 100,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const penguin = new Penguin(data);

      expect(penguin.name).toBe('Happy Feet');
      expect(penguin.species).toBe('Emperor');
      expect(penguin.age).toBe(5);
      expect(penguin.location).toBe('Antarctica');
      expect(penguin.weight).toBe(25);
      expect(penguin.height).toBe(100);
      expect(penguin.createdAt).toEqual(new Date('2024-01-01'));
      expect(penguin.updatedAt).toEqual(new Date('2024-01-01'));
    });

    test('should set default values for optional fields', () => {
      const data = {
        name: 'Skipper',
        species: 'Adelie',
      };

      const penguin = new Penguin(data);

      expect(penguin.age).toBeNull();
      expect(penguin.location).toBe('');
      expect(penguin.weight).toBeNull();
      expect(penguin.height).toBeNull();
      expect(penguin.createdAt).toBeInstanceOf(Date);
      expect(penguin.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('create', () => {
    test('should create a new penguin in the database', async () => {
      const penguinData = {
        name: 'Mumble',
        species: 'Emperor',
        age: 3,
        location: 'Ross Sea',
        weight: 30,
        height: 110,
      };

      const mockInsertedId = new ObjectId();
      mockCollection.insertOne.mockResolvedValue({
        insertedId: mockInsertedId,
      });

      const result = await Penguin.create(penguinData);

      expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('_id', mockInsertedId);
      expect(result.name).toBe('Mumble');
      expect(result.species).toBe('Emperor');
    });

    test('should handle database errors', async () => {
      const penguinData = {
        name: 'Error Penguin',
        species: 'Unknown',
      };

      mockCollection.insertOne.mockRejectedValue(new Error('Database error'));

      await expect(Penguin.create(penguinData)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    test('should return all penguins', async () => {
      const mockPenguins = [
        { _id: new ObjectId(), name: 'Penguin 1', species: 'Emperor' },
        { _id: new ObjectId(), name: 'Penguin 2', species: 'Adelie' },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockPenguins);

      const result = await Penguin.findAll();

      expect(mockCollection.find).toHaveBeenCalledWith({}, {});
      expect(result).toEqual(mockPenguins);
      expect(result).toHaveLength(2);
    });

    test('should accept query and options', async () => {
      const query = { species: 'Emperor' };
      const options = { limit: 5 };

      mockCollection.find().toArray.mockResolvedValue([]);

      await Penguin.findAll(query, options);

      expect(mockCollection.find).toHaveBeenCalledWith(query, options);
    });

    test('should return empty array when no penguins found', async () => {
      mockCollection.find().toArray.mockResolvedValue([]);

      const result = await Penguin.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    test('should find a penguin by ID', async () => {
      const mockId = new ObjectId();
      const mockPenguin = {
        _id: mockId,
        name: 'Rico',
        species: 'Chinstrap',
      };

      mockCollection.findOne.mockResolvedValue(mockPenguin);

      const result = await Penguin.findById(mockId.toString());

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: mockId,
      });
      expect(result).toEqual(mockPenguin);
    });

    test('should return null when penguin not found', async () => {
      const mockId = new ObjectId();
      mockCollection.findOne.mockResolvedValue(null);

      const result = await Penguin.findById(mockId.toString());

      expect(result).toBeNull();
    });

    test('should handle invalid ObjectId', async () => {
      await expect(Penguin.findById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updateById', () => {
    test('should update a penguin by ID', async () => {
      const mockId = new ObjectId();
      const updateData = {
        name: 'Updated Name',
        age: 6,
      };

      mockCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      const result = await Penguin.updateById(mockId.toString(), updateData);

      expect(mockCollection.updateOne).toHaveBeenCalledTimes(1);
      expect(result.matchedCount).toBe(1);
      expect(result.modifiedCount).toBe(1);
    });

    test('should not update createdAt field', async () => {
      const mockId = new ObjectId();
      const updateData = {
        name: 'Test',
        createdAt: new Date('2020-01-01'),
      };

      mockCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await Penguin.updateById(mockId.toString(), updateData);

      const callArgs = mockCollection.updateOne.mock.calls[0][1];
      expect(callArgs.$set).not.toHaveProperty('createdAt');
      expect(callArgs.$set).toHaveProperty('updatedAt');
    });

    test('should return no match when penguin not found', async () => {
      const mockId = new ObjectId();
      mockCollection.updateOne.mockResolvedValue({
        matchedCount: 0,
        modifiedCount: 0,
      });

      const result = await Penguin.updateById(mockId.toString(), { name: 'Test' });

      expect(result.matchedCount).toBe(0);
    });
  });

  describe('deleteById', () => {
    test('should delete a penguin by ID', async () => {
      const mockId = new ObjectId();
      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await Penguin.deleteById(mockId.toString());

      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        _id: mockId,
      });
      expect(result.deletedCount).toBe(1);
    });

    test('should return 0 when penguin not found', async () => {
      const mockId = new ObjectId();
      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      const result = await Penguin.deleteById(mockId.toString());

      expect(result.deletedCount).toBe(0);
    });
  });

  describe('getStats', () => {
    test('should return penguin statistics', async () => {
      const mockLatestPenguin = {
        _id: new ObjectId(),
        name: 'Latest Penguin',
        createdAt: new Date(),
      };

      mockCollection.countDocuments.mockResolvedValue(42);
      mockCollection.findOne.mockResolvedValue(mockLatestPenguin);

      const result = await Penguin.getStats();

      expect(mockCollection.countDocuments).toHaveBeenCalled();
      expect(mockCollection.findOne).toHaveBeenCalledWith(
        {},
        { sort: { createdAt: -1 } }
      );
      expect(result.total_penguins).toBe(42);
      expect(result.latest_penguin).toBe('Latest Penguin');
      expect(result.collection_name).toBe('penguin-data');
    });

    test('should handle no penguins in database', async () => {
      mockCollection.countDocuments.mockResolvedValue(0);
      mockCollection.findOne.mockResolvedValue(null);

      const result = await Penguin.getStats();

      expect(result.total_penguins).toBe(0);
      expect(result.latest_penguin).toBe('None');
    });
  });

  describe('search', () => {
    test('should search penguins by name', async () => {
      const mockResults = [
        { _id: new ObjectId(), name: 'Happy Feet', species: 'Emperor' },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockResults);

      const result = await Penguin.search('Happy');

      expect(mockCollection.find).toHaveBeenCalledTimes(1);
      const searchQuery = mockCollection.find.mock.calls[0][0];
      expect(searchQuery).toHaveProperty('$or');
      expect(result).toEqual(mockResults);
    });

    test('should search penguins by species', async () => {
      const mockResults = [
        { _id: new ObjectId(), name: 'Test', species: 'Emperor' },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockResults);

      const result = await Penguin.search('Emp');

      expect(result).toEqual(mockResults);
    });

    test('should be case-insensitive', async () => {
      mockCollection.find().toArray.mockResolvedValue([]);

      await Penguin.search('EMPEROR');

      const searchQuery = mockCollection.find.mock.calls[0][0];
      expect(searchQuery.$or[0].name).toBeInstanceOf(RegExp);
    });

    test('should return empty array when no matches', async () => {
      mockCollection.find().toArray.mockResolvedValue([]);

      const result = await Penguin.search('NonExistent');

      expect(result).toEqual([]);
    });
  });
});
