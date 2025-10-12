import { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@context/SocketContext';
import { useWhiteboard } from '@context/WhiteboardContext';
import { useAuth } from '@context/AuthContext';
import { SOCKET_EVENTS, SERVER_EVENTS } from '@constants/socketEvents';
import { CONFIG } from '@constants/config';

export const useCollaboration = (roomId) => {
  const { socket, emit, on, off } = useSocket();
  const { user } = useAuth();
  const {
    addDrawingAction,
    clearDrawingHistory,
    updateRoomUsers,
    joinRoom,
  } = useWhiteboard();

  const throttleTimerRef = useRef(null);

  // Join room
  const handleJoinRoom = useCallback(() => {
    if (!socket || !user || !roomId) return;

    emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      username: user.username,
      cursorColor: user.cursorColor,
    });
  }, [socket, user, roomId, emit]);

  // Leave room
  const handleLeaveRoom = useCallback(() => {
    if (!socket || !roomId) return;

    emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId });
  }, [socket, roomId, emit]);

  // Send drawing action
  const sendDrawingAction = useCallback((action, type = 'end') => {
    if (!socket || !roomId) return;

    const eventMap = {
      start: SOCKET_EVENTS.DRAWING_START,
      move: SOCKET_EVENTS.DRAWING_MOVE,
      end: SOCKET_EVENTS.DRAWING_END,
    };

    emit(eventMap[type], {
      roomId,
      action: {
        ...action,
        userId: user?.username || 'anonymous',
      },
    });
  }, [socket, roomId, user, emit]);

  // Send drawing move (throttled)
  const sendDrawingMove = useCallback((coordinates) => {
    if (throttleTimerRef.current) return;

    throttleTimerRef.current = setTimeout(() => {
      emit(SOCKET_EVENTS.DRAWING_MOVE, {
        roomId,
        coordinates,
      });
      throttleTimerRef.current = null;
    }, CONFIG.DRAWING_THROTTLE_MS);
  }, [roomId, emit]);

  // Send cursor position (throttled)
  const sendCursorPosition = useCallback((x, y) => {
    if (throttleTimerRef.current) return;

    throttleTimerRef.current = setTimeout(() => {
      emit(SOCKET_EVENTS.CURSOR_MOVE, {
        roomId,
        x,
        y,
      });
      throttleTimerRef.current = null;
    }, 50); // 20fps for cursor
  }, [roomId, emit]);

  // Clear canvas
  const sendClearCanvas = useCallback(() => {
    emit(SOCKET_EVENTS.CLEAR_CANVAS, { roomId });
  }, [roomId, emit]);

  // Undo action
  const sendUndoAction = useCallback((actionId) => {
    emit(SOCKET_EVENTS.UNDO_ACTION, { roomId, actionId });
  }, [roomId, emit]);

  // Setup event listeners
  useEffect(() => {
    if (!socket) return;

    // Room joined
    const handleRoomJoined = (data) => {
      console.log('Room joined:', data);
      joinRoom(data);
      updateRoomUsers(data.users);
    };

    // User joined
    const handleUserJoined = (data) => {
      console.log('User joined:', data);
      // Update users list will come from users-update event
    };

    // User left
    const handleUserLeft = (data) => {
      console.log('User left:', data);
    };

    // Users update
    const handleUsersUpdate = (data) => {
      console.log('Users updated:', data);
      updateRoomUsers(data.users);
    };

    // Drawing update
    const handleDrawingUpdate = (data) => {
      console.log('Drawing update:', data);
      if (data.action) {
        addDrawingAction(data.action);
      }
    };

    // Canvas cleared
    const handleCanvasCleared = (data) => {
      console.log('Canvas cleared:', data);
      clearDrawingHistory();
    };

    // Error
    const handleError = (data) => {
      console.error('Socket error:', data);
    };

    // Register listeners
    on(SERVER_EVENTS.ROOM_JOINED, handleRoomJoined);
    on(SERVER_EVENTS.USER_JOINED, handleUserJoined);
    on(SERVER_EVENTS.USER_LEFT, handleUserLeft);
    on(SERVER_EVENTS.USERS_UPDATE, handleUsersUpdate);
    on(SERVER_EVENTS.DRAWING_UPDATE, handleDrawingUpdate);
    on(SERVER_EVENTS.CANVAS_CLEARED, handleCanvasCleared);
    on(SERVER_EVENTS.ERROR, handleError);

    // Cleanup
    return () => {
      off(SERVER_EVENTS.ROOM_JOINED, handleRoomJoined);
      off(SERVER_EVENTS.USER_JOINED, handleUserJoined);
      off(SERVER_EVENTS.USER_LEFT, handleUserLeft);
      off(SERVER_EVENTS.USERS_UPDATE, handleUsersUpdate);
      off(SERVER_EVENTS.DRAWING_UPDATE, handleDrawingUpdate);
      off(SERVER_EVENTS.CANVAS_CLEARED, handleCanvasCleared);
      off(SERVER_EVENTS.ERROR, handleError);
    };
  }, [socket, on, off, joinRoom, updateRoomUsers, addDrawingAction, clearDrawingHistory]);

  return {
    handleJoinRoom,
    handleLeaveRoom,
    sendDrawingAction,
    sendDrawingMove,
    sendCursorPosition,
    sendClearCanvas,
    sendUndoAction,
  };
};