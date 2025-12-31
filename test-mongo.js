// test-mongo.js
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://erplogin:Ashish123@cluster0.uudjq57.mongodb.net/edupulse?retryWrites=true&w=majority';
(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('edupulse').command({ ping: 1 });
    console.log('Mongo connection OK');
    await client.close();
  } catch (e) {
    console.error('Mongo connection FAILED:', e);
    process.exit(1);
  }
})();