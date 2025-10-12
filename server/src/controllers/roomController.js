import Room from '../models/Room.js';
import Drawing from '../models/Drawing.js';
import logger from '../utils/logger.js';

// @desc    Get all active public rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true, isPublic: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    logger.error('Error fetching rooms:', error);
    next(error);
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:roomId
// @access  Public
export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true }).select(
      '-password'
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    logger.error('Error fetching room:', error);
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Public
export const createRoom = async (req, res, next) => {
  try {
    const { name, createdBy, description, maxUsers, isPublic, password } =
      req.body;

    const room = await Room.create({
      name,
      createdBy,
      description,
      maxUsers: maxUsers || 20,
      isPublic: isPublic !== undefined ? isPublic : true,
      password: password || null,
    });

    // Create associated drawing document
    await Drawing.create({
      roomId: room.roomId,
      actions: [],
    });

    logger.info(`Room created: ${room.roomId} by ${createdBy}`);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    logger.error('Error creating room:', error);
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:roomId
// @access  Public
export const updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.roomId;
    delete updates.createdBy;
    delete updates.currentUsers;

    const room = await Room.findOneAndUpdate(
      { roomId, isActive: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    logger.info(`Room updated: ${roomId}`);

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    logger.error('Error updating room:', error);
    next(error);
  }
};

// @desc    Delete room (soft delete)
// @route   DELETE /api/rooms/:roomId
// @access  Public
export const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOneAndUpdate(
      { roomId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    logger.info(`Room deleted: ${roomId}`);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting room:', error);
    next(error);
  }
};

// @desc    Get room statistics
// @route   GET /api/rooms/:roomId/stats
// @access  Public
export const getRoomStats = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    const drawing = await Drawing.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        roomId: room.roomId,
        name: room.name,
        currentUsers: room.currentUsers,
        maxUsers: room.maxUsers,
        totalActions: drawing ? drawing.totalActions : 0,
        createdAt: room.createdAt,
        lastModified: drawing ? drawing.updatedAt : room.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error fetching room stats:', error);
    next(error);
  }
};