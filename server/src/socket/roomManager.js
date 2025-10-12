import logger from '../utils/logger.js';

class RoomManager {
  constructor() {
    // Structure: { roomId: { users: Map, settings: {} } }
    this.rooms = new Map();
  }

  // Create or get room
  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        users: new Map(), // socketId -> user data
        createdAt: Date.now(),
      });
      logger.info(`Room manager: Created room ${roomId}`);
    }
    return this.rooms.get(roomId);
  }

  // Add user to room
  addUser(roomId, socketId, userData) {
    const room = this.createRoom(roomId);
    room.users.set(socketId, {
      ...userData,
      joinedAt: Date.now(),
    });
    logger.info(`Room manager: User ${userData.username} joined ${roomId}`);
    return room;
  }

  // Remove user from room
  removeUser(roomId, socketId) {
    const room = this.rooms.get(roomId);
    if (room) {
      const user = room.users.get(socketId);
      room.users.delete(socketId);
      
      // Clean up empty rooms
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
        logger.info(`Room manager: Deleted empty room ${roomId}`);
      }
      
      return user;
    }
    return null;
  }

  // Get all users in room
  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    return Array.from(room.users.values());
  }

  // Get user's current room
  getUserRoom(socketId) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.users.has(socketId)) {
        return roomId;
      }
    }
    return null;
  }

  // Get room count
  getRoomCount() {
    return this.rooms.size;
  }

  // Get user count in room
  getUserCount(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.users.size : 0;
  }

  // Check if room exists
  roomExists(roomId) {
    return this.rooms.has(roomId);
  }

  // Get all active rooms
  getAllRooms() {
    const roomsList = [];
    for (const [roomId, room] of this.rooms.entries()) {
      roomsList.push({
        roomId,
        userCount: room.users.size,
        users: Array.from(room.users.values()).map(u => ({
          username: u.username,
          cursorColor: u.cursorColor,
        })),
      });
    }
    return roomsList;
  }

  // Get room info
  getRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      roomId,
      userCount: room.users.size,
      users: Array.from(room.users.values()),
      createdAt: room.createdAt,
    };
  }
}

// Singleton instance
const roomManager = new RoomManager();

export default roomManager;