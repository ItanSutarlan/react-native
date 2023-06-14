const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGODB_URL;

let db = null;

const mongoConnect = async () => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const database = client.db('challenge2-p3');

    // Nilai variable global yang akan diset
    db = database;

    return database;
  } catch (err) {
    console.log(err);
    await client.close();
  }
};

const getDatabase = () => db;

module.exports = {
  mongoConnect,
  getDatabase,
};
