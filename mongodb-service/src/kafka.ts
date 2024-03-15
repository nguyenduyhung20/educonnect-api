import { Consumer, Kafka } from 'kafkajs';
import { PinoLogCreator } from './logger';

const topic = 'user-events';

export async function createKafkaConsumer(brokers: string[], groupId: string): Promise<Consumer> {
  const kafka = new Kafka({ brokers, logCreator: PinoLogCreator });
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });
  return consumer;
}
