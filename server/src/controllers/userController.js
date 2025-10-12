import User from '../models/User.js';
import logger from '../utils/logger.js';

// @desc    Get users in a room
// @route   GET /api/users/room/:roomId
// @access  Public
export const getUsersInRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const users = await User.find({
      currentRoom: roomId,
      isActive: true,
    }).select('-socketId');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

// @desc    Create or update user
// @route   POST /api/users
// @access  Public
export const createOrUpdateUser = async (req, res, next) => {
  try {
    const { username, socketId, currentRoom, cursorColor } = req.body;

    let user = await User.findOne({ username });

    if (user) {
      user.socketId = socketId;
      user.currentRoom = currentRoom;
      user.cursorColor = cursorColor || user.cursorColor;
      user.isActive = true;
      await user.save();
    } else {
      user = await User.create({
        username,
        socketId,
        currentRoom,
        cursorColor: cursorColor || '#3B82F6',
      });
    }

    logger.info(`User ${username} joined room ${currentRoom}`);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error creating/updating user:', error);
    next(error);
  }
};