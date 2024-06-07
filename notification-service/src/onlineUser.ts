interface User {
  userId: number;
  socketId: string;
}

export let onlineUsers: User[] = [];

export const addNewUser = (userId: number, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
};

export const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

export const getUser = (userId: number) => {
  return onlineUsers.find((user) => user.userId === userId);
};
