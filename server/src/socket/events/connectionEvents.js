import logger from '../../utils/logger.js';
import roomManager from '../roomManager.js';

export const handleConnection = (io, socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);

  // Send connection confirmation
  socket.emit('connected', {
    socketId: socket.id,
    timestamp: Date.now(),
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    handleDisconnect(io, socket, reason);
  });
};

export const handleDisconnect = (io, socket, reason) => {
  logger.info(`🔴 Client disconnected: ${socket.id} - Reason: ${reason}`);

  // Find which room the user was in
  const roomId = roomManager.getUserRoom(socket.id);
  
  if (roomId) {
    const user = roomManager.removeUser(roomId, socket.id);
    
    if (user) {
      // Notify others in the room
      socket.to(roomId).emit('user-left', {
        userId: socket.id,
        username: user.username,
        timestamp: Date.now(),
      });

      // Broadcast updated user list
      const remainingUsers = roomManager.getRoomUsers(roomId);
      io.to(roomId).emit('users-update', {
        users: remainingUsers,
        count: remainingUsers.length,
      });

      logger.info(`User ${user.username} left room ${roomId}`);
    }
  }
};