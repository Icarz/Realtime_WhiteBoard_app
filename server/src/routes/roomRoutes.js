import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
} from '../controllers/roomController.js';
import {
  validateRoomCreation,
  validateRoomId,
} from '../middleware/validation.js';
import { createRoomLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.route('/').get(getAllRooms).post(createRoomLimiter, validateRoomCreation, createRoom);

router
  .route('/:roomId')
  .get(validateRoomId, getRoomById)
  .put(validateRoomId, updateRoom)
  .delete(validateRoomId, deleteRoom);

router.route('/:roomId/stats').get(validateRoomId, getRoomStats);

export default router;