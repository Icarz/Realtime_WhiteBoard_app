import React, { createContext, useContext, useState, useCallback } from 'react';
import { TOOLS } from '@constants/tools';
import { DEFAULT_COLORS, DEFAULT_LINE_WIDTHS } from '@constants/colors';

const WhiteboardContext = createContext(null);

export const WhiteboardProvider = ({ children }) => {
  // Drawing state
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [lineWidth, setLineWidth] = useState(DEFAULT_LINE_WIDTHS[1]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Room state
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [drawingHistory, setDrawingHistory] = useState([]);

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Drawing actions
  const addDrawingAction = useCallback((action) => {
    setDrawingHistory((prev) => [...prev, action]);
  }, []);

  const clearDrawingHistory = useCallback(() => {
    setDrawingHistory([]);
  }, []);

  const undoLastAction = useCallback(() => {
    setDrawingHistory((prev) => prev.slice(0, -1));
  }, []);

  // Room actions
  const joinRoom = useCallback((roomData) => {
    setCurrentRoom(roomData);
    setDrawingHistory(roomData.drawingHistory || []);
  }, []);

  const leaveRoom = useCallback(() => {
    setCurrentRoom(null);
    setRoomUsers([]);
    setDrawingHistory([]);
  }, []);

  const updateRoomUsers = useCallback((users) => {
    setRoomUsers(users);
  }, []);

  // Tool actions
  const selectTool = useCallback((newTool) => {
    setTool(newTool);
    setIsDrawing(false);
  }, []);

  const selectColor = useCallback((newColor) => {
    setColor(newColor);
  }, []);

  const selectLineWidth = useCallback((newWidth) => {
    setLineWidth(newWidth);
  }, []);

  const value = {
    // Drawing state
    tool,
    color,
    lineWidth,
    isDrawing,
    setIsDrawing,

    // Room state
    currentRoom,
    roomUsers,
    drawingHistory,

    // Canvas state
    canvasSize,
    setCanvasSize,

    // Actions
    selectTool,
    selectColor,
    selectLineWidth,
    addDrawingAction,
    clearDrawingHistory,
    undoLastAction,
    joinRoom,
    leaveRoom,
    updateRoomUsers,
  };

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  );
};

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within WhiteboardProvider');
  }
  return context;
};