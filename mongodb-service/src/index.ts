import { logger } from './logger';
import { createKafkaConsumer } from './kafka';
import { connectToMongoDB } from './mongo';
import { processEvent } from './event';

const MONGO_DOMAIN = process.env.MONGO_DOMAIN ?? 'localhost';
const KAFKA_DOMAIN = process.env.KAFKA_DOMAIN ?? 'localhost';

const mongoURI = `mongodb://dev:password@${MONGO_DOMAIN}:27017`;
const kafkaBrokers = [`${KAFKA_DOMAIN}:29092`];
const consumerGroupId = 'mongodb-service';

async function main() {
  logger.info('MongoDB Service started');
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
