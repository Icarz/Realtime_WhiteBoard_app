import http from 'http';
import app from './app.js';
import connectDB from './config/database.js';
import { CONFIG } from './config/constants.js';
import { initializeSocketIO } from './config/socket.js';
import setupSocketHandlers from './socket/socketHandler.js';
import logger from './utils/logger.js';

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(server);

// Setup socket event handlers
setupSocketHandlers(io);

// Connect to database
connectDB();

// Start server
const PORT = CONFIG.PORT;

server.listen(PORT, () => {
  logger.info(`🚀 Server running in ${CONFIG.NODE_ENV} mode on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔌 Socket.IO ready for connections`);
  logger.info(`🌐 CORS enabled for: ${CONFIG.CLIENT_URL}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  io.close(() => {
    server.close(() => {
      logger.info('Process terminated');
    });
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  io.close(() => {
    server.close(() => {
      logger.info('Process terminated');
    });
  });
});

export default server;