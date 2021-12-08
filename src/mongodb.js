const {MongoClient} = require('mongodb');

let mongoClient = new MongoClient(process.env.MONGO_URL);
module.exports.mongoClient = mongoClient;
module.exports.db = mongoClient.db(process.env.MONGO_DB);
