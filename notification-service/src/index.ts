import { Server } from 'socket.io';
import { Kafka, Consumer } from 'kafkajs';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;
const KAFKA_BROKER_URI_1 = process.env.KAFKA_BROKER_URI_1 || 'localhost:29092';
const brokers = [KAFKA_BROKER_URI_1];
const clientId = 'kafka-consumer-client';
const topic = 'notification-topic';
const kafka = new Kafka({ clientId, brokers });
const consumer: Consumer = kafka.consumer({ groupId: clientId });

const connectToKafka = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic });
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka, retrying in 5 seconds...', error);
    setTimeout(connectToKafka, 5000);
  }
};

connectToKafka();

const io = new Server({
  cors: {
    origin: '*'
  }
});

interface User {
  userId: string;
  socketId: string;
}

let onlineUsers: User[] = [];

const addNewUser = (userId: string, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on('connection', async (socket) => {
  socket.on('newUser', (userId: string) => {
    console.log('User connected: ', userId);
    console.log('User socket id: ', socket.id);
    addNewUser(userId, socket.id);
  });

  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    console.log(senderName, receiver, type);
    if (receiver) {
      io.to(receiver.socketId).emit('getNotification', {
        senderName,
        type
      });
    }
  });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${topic} ${partition} ${message.value}`);
      try {
        if (message.value) {
          const { senderInfo, receiverID, content, postId } = JSON.parse(message.value.toString());

          const user = getUser(receiverID);
          if (user) {
            const payload = {
              senderInfo,
              content,
              postId
            };
            console.log('prepare data to send', payload);

            io.to(user.socketId).emit('getNotification', payload);
          }
        }
      } catch (error) {
        console.error('Failed to process Kafka message:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
    removeUser(socket.id);
  });
});

io.listen(PORT);
