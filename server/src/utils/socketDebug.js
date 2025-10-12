import logger from './logger.js';

class SocketDebugger {
  constructor() {
    this.events = [];
    this.maxEvents = 1000; // Keep last 1000 events
  }

  logEvent(eventType, socketId, data) {
    const event = {
      type: eventType,
      socketId,
      data,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug(`[SOCKET] ${eventType}`, {
        socketId,
        data: JSON.stringify(data).substring(0, 200), // Truncate long data
      });
    }
  }

  getRecentEvents(limit = 50) {
    return this.events.slice(-limit);
  }

  getEventsBySocket(socketId, limit = 50) {
    return this.events
      .filter(e => e.socketId === socketId)
      .slice(-limit);
  }

  getEventsByType(eventType, limit = 50) {
    return this.events
      .filter(e => e.type === eventType)
      .slice(-limit);
  }

  clearEvents() {
    this.events = [];
  }

  getStats() {
    const stats = {};
    this.events.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + 1;
    });
    return stats;
  }
}

const socketDebugger = new SocketDebugger();

export default socketDebugger;