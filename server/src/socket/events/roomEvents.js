import Room from '../../models/Room.js';
import Drawing from '../../models/Drawing.js';
import logger from '../../utils/logger.js';
import roomManager from '../roomManager.js';

export const handleJoinRoom = async (io, socket, data) => {
  try {
    const { roomId, username, cursorColor } = data;

    if (!roomId || !username) {
      socket.emit('error', {
        message: 'Room ID and username are required',
      });
      return;
    }

    // Check if room exists in database
    const room = await Room.findOne({ roomId, isActive: true });
    
    if (!room) {
      socket.emit('error', {
        message: 'Room not found',
      });
      return;
    }

    // Check if room is full
    const currentUserCount = roomManager.getUserCount(roomId);
    if (currentUserCount >= room.maxUsers) {
      socket.emit('error', {
        message: 'Room is full',
      });
      return;
    }

    // Leave current room if in one
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom) {
      await handleLeaveRoom(io, socket, { roomId: currentRoom });
    }

    // Join the socket.io room
    await socket.join(roomId);

    // Add user to room manager
    const userData = {
      socketId: socket.id,
      username,
      cursorColor: cursorColor || '#3B82F6',
    };
    
    roomManager.addUser(roomId, socket.id, userData);

    // Get drawing history
    const drawing = await Drawing.getOrCreate(roomId);

    // Get all users in room
    const users = roomManager.getRoomUsers(roomId);

    // Send room data to the joining user
    socket.emit('room-joined', {
      roomId,
      room: {
        name: room.name,
        description: room.description,
        maxUsers: room.maxUsers,
        currentUsers: users.length,
      },
      users,
      drawingHistory: drawing.actions,
      timestamp: Date.now(),
    });

    // Notify others about new user
    socket.to(roomId).emit('user-joined', {
      user: userData,
      timestamp: Date.now(),
    });

    // Broadcast updated user list to all
    io.to(roomId).emit('users-update', {
      users,
      count: users.length,
    });

    // Update room user count in database
    await room.addUser();

    logger.info(`✅ ${username} joined room ${roomId}`);
  } catch (error) {
    logger.error('Error joining room:', error);
    socket.emit('error', {
      message: 'Failed to join room',
      error: error.message,
    });
  }
};

export const handleLeaveRoom = async (io, socket, data) => {
  try {
    const { roomId } = data;

    if (!roomId) {
      return;
    }

    // Remove user from room manager
    const user = roomManager.removeUser(roomId, socket.id);

    if (user) {
      // Leave socket.io room
      await socket.leave(roomId);

      // Notify others
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

      // Update room user count in database
      const room = await Room.findOne({ roomId });
      if (room) {
        await room.removeUser();
      }

      logger.info(`User ${user.username} left room ${roomId}`);
    }
  } catch (error) {
    logger.error('Error leaving room:', error);
  }
};

export const handleGetRoomUsers = (socket, data) => {
  try {
    const { roomId } = data;

    if (!roomId) {
      socket.emit('error', {
        message: 'Room ID is required',
      });
      return;
    }

    const users = roomManager.getRoomUsers(roomId);

    socket.emit('room-users', {
      roomId,
      users,
      count: users.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error getting room users:', error);
    socket.emit('error', {
      message: 'Failed to get room users',
    });
  }
};