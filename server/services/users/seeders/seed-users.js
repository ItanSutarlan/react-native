if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { ObjectId, MongoClient } = require('mongodb');
const { hashPassword } = require('../helpers/bcrypt');

const users = require('../data/users.json');

async function seedDB() {
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const database = client.db('challenge2-p3');

    const collection = database.collection('users');
    collection.drop();

    // series data
    users.forEach((user) => {
      user._id = new ObjectId(user._id);
      user.password = hashPassword(user.password);
    });

    await collection.insertMany(users);

    console.log('Users seeded! :)');
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();
