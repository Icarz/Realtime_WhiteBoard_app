import { Server } from 'socket.io';
import { CONFIG } from './constants.js';
import logger from '../utils/logger.js';

export const initializeSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CONFIG.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8, // 100 MB
    transports: ['websocket', 'polling'],
  });

  logger.info('✅ Socket.IO initialized');

  return io;
};

export const socketConfig = {
  // Socket.io namespaces (if needed in future)
  namespaces: {
    default: '/',
    whiteboard: '/whiteboard',
  },
  
  // Event throttling config
  throttle: {
    drawingMove: 16, // ~60fps
    cursorMove: 50,  // ~20fps
  },
};