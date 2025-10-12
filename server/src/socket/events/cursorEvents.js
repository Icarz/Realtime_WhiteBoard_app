import roomManager from '../roomManager.js';
import logger from '../../utils/logger.js';

export const handleCursorMove = (io, socket, data) => {
  try {
    const { roomId, x, y } = data;

    if (!roomId || x === undefined || y === undefined) {
      return; // Silently ignore invalid data
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      return;
    }

    // Get user info
    const users = roomManager.getRoomUsers(roomId);
    const user = users.find(u => u.socketId === socket.id);

    if (!user) {
      return;
    }

    // Broadcast cursor position to others (not to sender)
    socket.to(roomId).emit('cursor-position', {
      userId: socket.id,
      username: user.username,
      cursorColor: user.cursorColor,
      x,
      y,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error handling cursor move:', error);
  }
};

export const handleCursorLeave = (io, socket, data) => {
  try {
    const { roomId } = data;

    if (!roomId) {
      return;
    }

    // Notify others that cursor left
    socket.to(roomId).emit('cursor-left', {
      userId: socket.id,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error handling cursor leave:', error);
  }
};