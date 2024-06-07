import { logger } from './logger';
import { createKafkaConsumer } from './kafka';
import { connectToMongoDB } from './mongo';
import { processEvent } from './event';

const MONGO_DOMAIN = process.env.MONGO_DOMAIN || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27018';
const KAFKA_DOMAIN = process.env.KAFKA_DOMAIN || 'localhost';
const KAFKA_PORT = process.env.KAFKA_PORT || '29092';

const mongoURI = `mongodb://dev:password@${MONGO_DOMAIN}:${MONGO_PORT}`;
const kafkaBrokers = [`${KAFKA_DOMAIN}:${KAFKA_PORT}`];
const consumerGroupId = 'mongodb-service';

async function main() {
  logger.info(`MongoDB Service started with ${kafkaBrokers} ${MONGO_DOMAIN}:27017`);
  const collection = await connectToMongoDB(mongoURI);
  const consumer = await createKafkaConsumer(kafkaBrokers, consumerGroupId);

  if (!consumer) {
    return;
  }

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
