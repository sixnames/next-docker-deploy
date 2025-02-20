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

  const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
  const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

  if (!MONGODB_CONNECTION_STRING || !MONGODB_DATABASE) {
    throw new Error('Unable to connect to database, no URI or database name provided');
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(MONGODB_CONNECTION_STRING, {
    ignoreUndefined: false,
  });

  // Select the database through the connection
  const db = client.db(MONGODB_DATABASE);

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