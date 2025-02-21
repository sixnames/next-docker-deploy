import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';

interface GetDbPayloadInterface {
  db: Db;
  client: MongoClient;
}

// Create cached connection variable
let cachedDb: GetDbPayloadInterface | undefined;

export async function getDatabase(): Promise<GetDbPayloadInterface> {
  // If the database connection is cached, use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

  if (!MONGODB_URI || !MONGO_DB_NAME) {
    throw new Error('Unable to connect to database, no URI or database name provided');
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(MONGODB_URI, {
    ignoreUndefined: false,
    authSource: 'admin',
  });

  // Select the database through the connection
  const db = client.db(MONGO_DB_NAME);

  const payload: GetDbPayloadInterface = {
    db,
    client,
  };

  // Cache the database connection and return the connection
  cachedDb = payload;
  return payload;
}

export async function getDbClient() {
  const { client } = await getDatabase();
  return client;
}

function generateDbCollections({ db, client }: GetDbPayloadInterface) {
  return {
    db,
    client,
    configsCollection: () => db.collection('configs'),
  };
}

export async function getDbCollections() {
  const { db, client } = await getDatabase();
  return generateDbCollections({ db, client });
}

export async function getConfigsCollection() {
  const collections = await getDbCollections();
  return collections.configsCollection();
}