import { Server } from 'socket.io';
import { addNewUser, getUser, removeUser } from './onlineUser';
import { connectToKafka, startKafkaConsumer } from './kafka';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;

const io = new Server({
  cors: {
    origin: '*'
  }
});

type NewUserMessageValue = {
  userId: number;
};
io.on('connection', async (socket) => {
  socket.on('newUser', ({ userId }: NewUserMessageValue) => {
    console.log('User connected with id: ', userId);
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

  socket.on('disconnect', () => {
    console.log('User disconnected with id: ', socket.id);
    removeUser(socket.id);
  });
});

const startServer = async () => {
  try {
    await connectToKafka();
    await startKafkaConsumer(io);
    io.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
