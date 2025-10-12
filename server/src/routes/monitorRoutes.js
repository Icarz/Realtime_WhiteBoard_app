import express from 'express';
import roomManager from '../socket/roomManager.js';

const router = express.Router();

// Get all active rooms and their users
router.get('/rooms', (req, res) => {
  const rooms = roomManager.getAllRooms();
  
  res.status(200).json({
    success: true,
    totalRooms: rooms.length,
    data: rooms,
  });
});

// Get specific room info
router.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomInfo = roomManager.getRoomInfo(roomId);
  
  if (!roomInfo) {
    return res.status(404).json({
      success: false,
      error: 'Room not found in active sessions',
    });
  }
  
  res.status(200).json({
    success: true,
    data: roomInfo,
  });
});

// Get server statistics
router.get('/stats', (req, res) => {
  const rooms = roomManager.getAllRooms();
  const totalUsers = rooms.reduce((acc, room) => acc + room.userCount, 0);
  
  res.status(200).json({
    success: true,
    data: {
      totalRooms: rooms.length,
      totalUsers,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: Date.now(),
    },
  });
});

export default router;