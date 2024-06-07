import { Kafka, Partitioners, EachMessagePayload } from 'kafkajs';
import { KAFKA } from '../constants/constants';
import path from 'path';
import { readFileSync } from 'fs';

const rootDir = path.resolve(__dirname, '..', '..');
const caCertPath = path.resolve(rootDir, 'ca.pem');
const caCert = readFileSync(caCertPath, 'utf-8');

const brokers = [KAFKA.KAFKA_BROKER_URI_1];

const kafka = new Kafka({
  clientId: 'web-server-client',
  brokers,
  ssl: {
    rejectUnauthorized: false,
    ca: [caCert]
  },
  sasl: {
    mechanism: 'scram-sha-512',
    username: KAFKA.KAFKA_USERNAME,
    password: KAFKA.KAFKA_PASSWORD
  }
});

const consumerInstance = kafka.consumer({ groupId: 'web-server-consumer-client' });
const producerInstance = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

export async function consumer(topic: string, consumer = consumerInstance) {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      console.log(`received message: ${topic} ${partition} ${message.value}`);
    }
  });
}

export async function producer(topic: string, messages: any, producer = producerInstance) {
  await producer.connect();
  await producer.send({
    topic,
    messages: messages
  });
}
