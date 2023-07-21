let io: any;

export const init = (httpServer: any, options: any) => {
  io = require('socket.io')(httpServer, options);
  return io;
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }

  return io;
}