import { Consumer, Kafka } from 'kafkajs';
import { Server } from 'socket.io';
import { getUser } from './onlineUser';
import { readFileSync } from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const caCertPath = path.resolve(rootDir, 'ca.pem');
const caCert = readFileSync(caCertPath, 'utf-8');

const KAFKA_BROKER_URI_1 = process.env.KAFKA_BROKER_URI_1 || 'localhost:29092';

const CLIENT_ID = 'notification-service-client';
const NOTIFICATION_TOPIC = 'notification-topic';

const brokers = [KAFKA_BROKER_URI_1];
const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers,
  ssl: {
    rejectUnauthorized: false,
    ca: [caCert]
  },
  sasl: {
    mechanism: 'scram-sha-512',
    username: process.env.KAFKA_USERNAME ?? '',
    password: process.env.KAFKA_PASSWORD ?? ''
  }
});

const consumer: Consumer = kafka.consumer({ groupId: CLIENT_ID });

export const connectToKafka = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: NOTIFICATION_TOPIC });
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka, retrying in 5 seconds...', error);
    setTimeout(connectToKafka, 5000);
  }
};

export const mockData = '{ "senderInfo": 1, "receiverID": 2, "content": "uhh", "itemId": 2 }';

export const startKafkaConsumer = async (io: Server) => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${topic} ${partition} ${message.value}`);
      try {
        if (message.value) {
          const { senderInfo, receiverID, content, itemId } = JSON.parse(message.value.toString());
          const user = getUser(receiverID);
          if (user) {
            const payload = {
              senderInfo,
              content,
              itemId
            };
            console.log('Prepare data to send', payload);

            io.to(user.socketId).emit('getNotification', payload);
          }
        }
      } catch (error) {
        console.error('Failed to process Kafka message:', error);
      }
    }
  });
};
