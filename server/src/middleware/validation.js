import logger from '../utils/logger.js';

// Validate room creation
export const validateRoomCreation = (req, res, next) => {
  const { name, createdBy } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Room name must be at least 2 characters');
  }

  if (!createdBy || createdBy.trim().length < 2) {
    errors.push('Creator name must be at least 2 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

// Validate room ID
export const validateRoomId = (req, res, next) => {
  const { roomId } = req.params;

  if (!roomId || roomId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Room ID is required',
    });
  }

  next();
};

// Validate drawing action
export const validateDrawingAction = (req, res, next) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      error: 'Drawing action is required',
    });
  }

  const { type, tool, coordinates, userId } = action;

  const errors = [];

  if (!type) errors.push('Action type is required');
  if (!tool) errors.push('Tool is required');
  if (!coordinates || !Array.isArray(coordinates)) {
    errors.push('Coordinates must be an array');
  }
  if (!userId) errors.push('User ID is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
};