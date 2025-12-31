import { MongoClient } from 'mongodb';

// Prefer environment variable; fallback to the previous string for local dev only
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error('Missing MONGODB_URL environment variable');
}
const DATABASE_NAME = process.env.MONGODB_DB ?? "edupulse";

let clientPromise: Promise<MongoClient> | null = null;

function createClient() {
  return new MongoClient(MONGODB_URL);
}

// Lazily connect only when called at runtime. This avoids attempts to connect during `next build`.
export async function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const client = createClient();
    clientPromise = client.connect().catch((err) => {
      // Reset so future attempts can retry and surface the error properly
      clientPromise = null;
      console.error('MongoDB connection failed:', err);
      throw err;
    });
  }
  return clientPromise;
}

export async function getDb() {
  const client = await getClient();
  return client.db(DATABASE_NAME);
}

export default getDb;
