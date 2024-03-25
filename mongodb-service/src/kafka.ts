import { Kafka } from 'kafkajs';
import { PinoLogCreator, logger } from './logger';

const topic = 'user-events';

export async function createKafkaConsumer(brokers: string[], groupId: string) {
  try {
    logger.info(brokers);
    const kafka = new Kafka({ brokers, logCreator: PinoLogCreator });
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic });
    return consumer;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      logger.warn('Kafka broker not found. Skipping consumer creation.');
      return null;
    }
  }
}
