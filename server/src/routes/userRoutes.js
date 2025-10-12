import express from 'express';
import {
  getUsersInRoom,
  createOrUpdateUser,
} from '../controllers/userController.js';
import { validateRoomId } from '../middleware/validation.js';

const router = express.Router();

router.route('/').post(createOrUpdateUser);

router.route('/room/:roomId').get(validateRoomId, getUsersInRoom);

export default router;