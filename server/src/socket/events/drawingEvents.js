import Drawing from '../../models/Drawing.js';
import logger from '../../utils/logger.js';
import socketDebugger from '../../utils/socketDebug.js';
import roomManager from '../roomManager.js';

export const handleDrawingStart = async (io, socket, data) => {
   socketDebugger.logEvent('drawing-start', socket.id, data);
  try {
    const { roomId, action } = data;

    if (!roomId || !action) {
      socket.emit('error', {
        message: 'Room ID and action are required',
      });
      return;
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      socket.emit('error', {
        message: 'You are not in this room',
      });
      return;
    }

    // Broadcast to others in the room
    socket.to(roomId).emit('drawing-update', {
      action: {
        ...action,
        socketId: socket.id,
      },
      type: 'start',
      timestamp: Date.now(),
    });

    logger.debug(`Drawing started in room ${roomId} by ${socket.id}`);
  } catch (error) {
    logger.error('Error handling drawing start:', error);
  }
};

export const handleDrawingMove = async (io, socket, data) => {
  try {
    const { roomId, coordinates } = data;

    if (!roomId || !coordinates) {
      return; // Silently ignore to prevent spam
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      return;
    }

    // Broadcast to others (throttled on client side)
    socket.to(roomId).emit('drawing-update', {
      coordinates,
      socketId: socket.id,
      type: 'move',
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error handling drawing move:', error);
  }
};

export const handleDrawingEnd = async (io, socket, data) => {
  try {
    const { roomId, action } = data;

    if (!roomId || !action) {
      socket.emit('error', {
        message: 'Room ID and action are required',
      });
      return;
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      socket.emit('error', {
        message: 'You are not in this room',
      });
      return;
    }

    // Save to database
    const drawing = await Drawing.getOrCreate(roomId);
    await drawing.addAction({
      ...action,
      userId: socket.id,
      timestamp: Date.now(),
    });

    // Broadcast to others in the room
    socket.to(roomId).emit('drawing-update', {
      action: {
        ...action,
        socketId: socket.id,
      },
      type: 'end',
      timestamp: Date.now(),
    });

    logger.debug(`Drawing ended in room ${roomId} by ${socket.id}`);
  } catch (error) {
    logger.error('Error handling drawing end:', error);
    socket.emit('error', {
      message: 'Failed to save drawing',
    });
  }
};

export const handleClearCanvas = async (io, socket, data) => {
  try {
    const { roomId } = data;

    if (!roomId) {
      socket.emit('error', {
        message: 'Room ID is required',
      });
      return;
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      socket.emit('error', {
        message: 'You are not in this room',
      });
      return;
    }

    // Clear in database
    const drawing = await Drawing.findOne({ roomId });
    if (drawing) {
      await drawing.clearActions(socket.id);
    }

    // Broadcast to everyone including sender
    io.to(roomId).emit('canvas-cleared', {
      clearedBy: socket.id,
      timestamp: Date.now(),
    });

    logger.info(`Canvas cleared in room ${roomId} by ${socket.id}`);
  } catch (error) {
    logger.error('Error clearing canvas:', error);
    socket.emit('error', {
      message: 'Failed to clear canvas',
    });
  }
};

export const handleUndoAction = async (io, socket, data) => {
  try {
    const { roomId, actionId } = data;

    if (!roomId || !actionId) {
      socket.emit('error', {
        message: 'Room ID and action ID are required',
      });
      return;
    }

    // Verify user is in the room
    const currentRoom = roomManager.getUserRoom(socket.id);
    if (currentRoom !== roomId) {
      socket.emit('error', {
        message: 'You are not in this room',
      });
      return;
    }

    // Undo in database
    const drawing = await Drawing.findOne({ roomId });
    if (drawing) {
      await drawing.undoAction(actionId);
    }

    // Broadcast to everyone including sender
    io.to(roomId).emit('action-undone', {
      actionId,
      undoneBy: socket.id,
      timestamp: Date.now(),
    });

    logger.info(`Action ${actionId} undone in room ${roomId}`);
  } catch (error) {
    logger.error('Error undoing action:', error);
    socket.emit('error', {
      message: 'Failed to undo action',
    });
  }
};