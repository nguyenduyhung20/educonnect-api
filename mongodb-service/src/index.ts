import { MongoClient, Collection } from 'mongodb';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

const mongoURI = 'mongodb://dev:password@mongodb:27017/educonnect';
const kafkaBrokers = ['kafka:9092'];
const topic = 'user-events';
const consumerGroupId = 'mongodb-service';

async function connectToMongoDB(uri: string): Promise<Collection> {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  return db.collection('userEvents');
}

async function createKafkaConsumer(brokers: string[], groupId: string): Promise<Consumer> {
  const kafka = new Kafka({ brokers });
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });
  return consumer;
}

interface UserPostInteractionEvent {
  userId: string;
  postId: string;
  interactionType: 'LIKE' | 'COMMENT' | 'SHARE' | 'VIEW';
  timestamp: Date;
  metadata?: {
    [key: string]: any;
  };
}
async function processEvent(collection: Collection, { message }: EachMessagePayload) {
  if (message.value === null) {
    console.warn('Received message with null value. Skipping processing.');
    return;
  }
  try {
    const event: UserPostInteractionEvent = JSON.parse(message.value.toString());
    await collection.insertOne(event);
    console.log(`Stored event: ${JSON.stringify(event)}`);
  } catch (error) {
    console.error(`Error processing event: ${error}`);
  }
}

async function main() {
  console.log('called');

  const collection = await connectToMongoDB(mongoURI);
  const consumer = await createKafkaConsumer(kafkaBrokers, consumerGroupId);

  await consumer.run({
    eachMessage: async (payload) => {
      await processEvent(collection, payload);
    }
  });

  process.on('SIGINT', async () => {
    await consumer.disconnect();
    process.exit(0);
  });
}

main().catch(console.error);
