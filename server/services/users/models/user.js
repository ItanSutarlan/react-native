const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class User {
  static getCollections() {
    const db = getDatabase();
    const users = db.collection('users');
    return users;
  }

  static async findAll() {
    return this.getCollections().find().toArray();
  }

  static async createUser(user) {
    return this.getCollections().insertOne(user);
  }

  static async findById(objectId) {
    return this.getCollections().findOne({
      _id: new ObjectId(objectId),
    });
  }

  static async deleteById(objectId) {
    return this.getCollections().deleteOne({
      _id: new ObjectId(objectId),
    });
  }
}

module.exports = User;
