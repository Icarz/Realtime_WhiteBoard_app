import { handleConnection, handleDisconnect } from './events/connectionEvents.js';
import {
  handleJoinRoom,
  handleLeaveRoom,
  handleGetRoomUsers,
} from './events/roomEvents.js';
import {
  handleDrawingStart,
  handleDrawingMove,
  handleDrawingEnd,
  handleClearCanvas,
  handleUndoAction,
} from './events/drawingEvents.js';
import {
  handleCursorMove,
  handleCursorLeave,
} from './events/cursorEvents.js';
import logger from '../utils/logger.js';
import roomManager from './roomManager.js';

const setupSocketHandlers = (io) => {
  // Middleware for authentication (can be expanded later)
  io.use((socket, next) => {
    // You can add token verification here
    logger.debug(`Socket middleware: ${socket.id}`);
    next();
  });

  // Connection handler
  io.on('connection', (socket) => {
    handleConnection(io, socket);

    // Room events
    socket.on('join-room', (data) => handleJoinRoom(io, socket, data));
    socket.on('leave-room', (data) => handleLeaveRoom(io, socket, data));
    socket.on('get-room-users', (data) => handleGetRoomUsers(socket, data));

    // Drawing events
    socket.on('drawing-start', (data) => handleDrawingStart(io, socket, data));
    socket.on('drawing-move', (data) => handleDrawingMove(io, socket, data));
    socket.on('drawing-end', (data) => handleDrawingEnd(io, socket, data));
    socket.on('clear-canvas', (data) => handleClearCanvas(io, socket, data));
    socket.on('undo-action', (data) => handleUndoAction(io, socket, data));

    // Cursor events
    socket.on('cursor-move', (data) => handleCursorMove(io, socket, data));
    socket.on('cursor-leave', (data) => handleCursorLeave(io, socket, data));

    // Ping/Pong for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error (${socket.id}):`, error);
    });
  });

  // Log active connections every 30 seconds (for monitoring)
  setInterval(() => {
    const roomCount = roomManager.getRoomCount();
    const totalSockets = io.sockets.sockets.size;
    logger.info(`📊 Stats - Active Rooms: ${roomCount}, Connected Sockets: ${totalSockets}`);
  }, 30000);

  logger.info('✅ Socket handlers initialized');
};

export default setupSocketHandlers;