import express from 'express';
import socketDebugger from '../utils/socketDebug.js';

const router = express.Router();

// Only enable in development
if (process.env.NODE_ENV === 'development') {
  // Get recent socket events
  router.get('/events', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const events = socketDebugger.getRecentEvents(limit);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  // Get events by socket ID
  router.get('/events/socket/:socketId', (req, res) => {
    const { socketId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const events = socketDebugger.getEventsBySocket(socketId, limit);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  // Get events by type
  router.get('/events/type/:eventType', (req, res) => {
    const { eventType } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const events = socketDebugger.getEventsByType(eventType, limit);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  });

  // Get event statistics
  router.get('/stats', (req, res) => {
    const stats = socketDebugger.getStats();
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  // Clear debug events
  router.delete('/events', (req, res) => {
    socketDebugger.clearEvents();
    
    res.status(200).json({
      success: true,
      message: 'Debug events cleared',
    });
  });
}

export default router;