import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TOOLS } from '@constants/tools';
import { useWhiteboard } from '@context/WhiteboardContext';
import { useCanvas } from './useCanvas';

export const useDrawing = (canvasRef, contextRef) => {
  const {
    tool,
    color,
    lineWidth,
    isDrawing,
    setIsDrawing,
    addDrawingAction,
  } = useWhiteboard();

  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState([]);
  const snapshotRef = useRef(null);

  const canvas = useCanvas(canvasRef, contextRef);

  // Start drawing
  const startDrawing = useCallback((e) => {
    const pos = canvas.getMousePos(e);
    setStartPos(pos);
    setCurrentPath([pos]);

    const ctx = contextRef.current;

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      ctx.strokeStyle = tool === TOOLS.ERASER ? '#FFFFFF' : color;
      ctx.lineWidth = tool === TOOLS.ERASER ? lineWidth * 3 : lineWidth;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    } else {
      // Save snapshot for shapes
      snapshotRef.current = canvas.saveSnapshot();
      setIsDrawing(true);
    }
  }, [tool, color, lineWidth, canvas, contextRef, setIsDrawing]);

  // Draw
  const draw = useCallback((e) => {
    if (!isDrawing) return;

    const pos = canvas.getMousePos(e);
    const ctx = contextRef.current;

    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setCurrentPath(prev => [...prev, pos]);
    } else {
      // Restore snapshot and draw shape preview
      if (snapshotRef.current) {
        canvas.restoreSnapshot(snapshotRef.current);
      }

      if (tool === TOOLS.RECTANGLE) {
        canvas.drawRectangle(startPos.x, startPos.y, pos.x, pos.y, color, lineWidth);
      } else if (tool === TOOLS.CIRCLE) {
        canvas.drawCircle(startPos.x, startPos.y, pos.x, pos.y, color, lineWidth);
      } else if (tool === TOOLS.LINE) {
        canvas.drawLine(startPos.x, startPos.y, pos.x, pos.y, color, lineWidth);
      }
    }
  }, [isDrawing, tool, color, lineWidth, startPos, canvas, contextRef]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    const ctx = contextRef.current;
    ctx.closePath();

    // Create drawing action
    const action = {
      id: uuidv4(),
      type: tool === TOOLS.ERASER ? 'erase' : tool === TOOLS.TEXT ? 'text' : 'draw',
      tool,
      coordinates: currentPath,
      color,
      lineWidth,
      timestamp: Date.now(),
    };

    addDrawingAction(action);
    setIsDrawing(false);
    setCurrentPath([]);
    snapshotRef.current = null;

    return action;
  }, [isDrawing, tool, color, lineWidth, currentPath, addDrawingAction, setIsDrawing, contextRef]);

  return {
    startDrawing,
    draw,
    stopDrawing,
  };
};