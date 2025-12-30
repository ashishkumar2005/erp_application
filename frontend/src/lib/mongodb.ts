import { MongoClient } from 'mongodb';

const MONGODB_URL = "mongodb+srv://erplogin:erp123@cluster0.uudjq57.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "edupulse";

if (!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URL environment variable');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URL);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URL);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME);
}
