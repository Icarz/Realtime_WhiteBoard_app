import Drawing from '../models/Drawing.js';
import Room from '../models/Room.js';
import logger from '../utils/logger.js';

// @desc    Get drawing history for a room
// @route   GET /api/drawings/:roomId
// @access  Public
export const getDrawingHistory = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Check if room exists
    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    const drawing = await Drawing.getOrCreate(roomId);

    res.status(200).json({
      success: true,
      data: {
        roomId: drawing.roomId,
        actions: drawing.actions,
        totalActions: drawing.totalActions,
        lastModifiedBy: drawing.lastModifiedBy,
        updatedAt: drawing.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error fetching drawing history:', error);
    next(error);
  }
};

// @desc    Save drawing action
// @route   POST /api/drawings/:roomId/actions
// @access  Public
export const saveDrawingAction = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { action } = req.body;

    const drawing = await Drawing.getOrCreate(roomId);
    await drawing.addAction(action);

    logger.info(`Drawing action saved: ${action.id} in room ${roomId}`);

    res.status(201).json({
      success: true,
      data: {
        actionId: action.id,
        totalActions: drawing.totalActions,
      },
    });
  } catch (error) {
    logger.error('Error saving drawing action:', error);
    next(error);
  }
};

// @desc    Clear drawing
// @route   DELETE /api/drawings/:roomId
// @access  Public
export const clearDrawing = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const drawing = await Drawing.findOne({ roomId });

    if (!drawing) {
      return res.status(404).json({
        success: false,
        error: 'Drawing not found',
      });
    }

    await drawing.clearActions(userId);

    logger.info(`Drawing cleared in room ${roomId} by ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Drawing cleared successfully',
    });
  } catch (error) {
    logger.error('Error clearing drawing:', error);
    next(error);
  }
};

// @desc    Undo drawing action
// @route   DELETE /api/drawings/:roomId/actions/:actionId
// @access  Public
export const undoDrawingAction = async (req, res, next) => {
  try {
    const { roomId, actionId } = req.params;

    const drawing = await Drawing.findOne({ roomId });

    if (!drawing) {
      return res.status(404).json({
        success: false,
        error: 'Drawing not found',
      });
    }

    await drawing.undoAction(actionId);

    logger.info(`Action ${actionId} undone in room ${roomId}`);

    res.status(200).json({
      success: true,
      message: 'Action undone successfully',
      totalActions: drawing.totalActions,
    });
  } catch (error) {
    logger.error('Error undoing action:', error);
    next(error);
  }
};

// @desc    Export drawing as JSON
// @route   GET /api/drawings/:roomId/export
// @access  Public
export const exportDrawing = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const drawing = await Drawing.findOne({ roomId });
    const room = await Room.findOne({ roomId });

    if (!drawing || !room) {
      return res.status(404).json({
        success: false,
        error: 'Drawing or room not found',
      });
    }

    const exportData = {
      roomName: room.name,
      roomId: room.roomId,
      exportedAt: new Date().toISOString(),
      totalActions: drawing.totalActions,
      actions: drawing.actions,
    };

    res.status(200).json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    logger.error('Error exporting drawing:', error);
    next(error);
  }
};