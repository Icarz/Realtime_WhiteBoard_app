import express from 'express';
import {
  getDrawingHistory,
  saveDrawingAction,
  clearDrawing,
  undoDrawingAction,
  exportDrawing,
} from '../controllers/drawingController.js';
import {
  validateRoomId,
  validateDrawingAction,
} from '../middleware/validation.js';

const router = express.Router();

router
  .route('/:roomId')
  .get(validateRoomId, getDrawingHistory)
  .delete(validateRoomId, clearDrawing);

router
  .route('/:roomId/actions')
  .post(validateRoomId, validateDrawingAction, saveDrawingAction);

router
  .route('/:roomId/actions/:actionId')
  .delete(validateRoomId, undoDrawingAction);

router.route('/:roomId/export').get(validateRoomId, exportDrawing);

export default router;