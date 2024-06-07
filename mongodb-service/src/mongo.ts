import { Collection, MongoClient } from 'mongodb';
import { logger } from './logger';

const MONGO_DATABASE = process.env.MONGO_DATABASE ?? 'educonnect';
const USER_EVENTS_COLLECTION_NAME = 'user_events';

export async function connectToMongoDB(uri: string): Promise<Collection> {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(MONGO_DATABASE);

  const collections = await db.listCollections({ name: USER_EVENTS_COLLECTION_NAME }).toArray();
  if (collections.length === 0) {
    await db.createCollection(USER_EVENTS_COLLECTION_NAME);
    logger.info('Created userEvents collection');
  }
  return db.collection(USER_EVENTS_COLLECTION_NAME);
}
