import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MAX_USERS_PER_ROOM: parseInt(process.env.MAX_USERS_PER_ROOM) || 20,
  MAX_DRAWING_ACTIONS: parseInt(process.env.MAX_DRAWING_ACTIONS) || 10000,
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  DRAWING_START: 'drawing-start',
  DRAWING_MOVE: 'drawing-move',
  DRAWING_END: 'drawing-end',
  CLEAR_CANVAS: 'clear-canvas',
  UNDO_ACTION: 'undo-action',
  CURSOR_MOVE: 'cursor-move',
};

export const SERVER_EVENTS = {
  ROOM_JOINED: 'room-joined',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  DRAWING_UPDATE: 'drawing-update',
  CANVAS_CLEARED: 'canvas-cleared',
  ACTION_UNDONE: 'action-undone',
  CURSOR_POSITION: 'cursor-position',
  ERROR: 'error',
};