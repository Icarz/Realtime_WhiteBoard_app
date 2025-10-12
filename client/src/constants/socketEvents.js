// Client emits
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  
  // Drawing events
  DRAWING_START: 'drawing-start',
  DRAWING_MOVE: 'drawing-move',
  DRAWING_END: 'drawing-end',
  CLEAR_CANVAS: 'clear-canvas',
  UNDO_ACTION: 'undo-action',
  
  // Cursor events
  CURSOR_MOVE: 'cursor-move',
};

// Server emits
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