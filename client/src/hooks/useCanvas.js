import {   useCallback } from 'react';

export const useCanvas = (canvasRef, contextRef) => {
  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    // Set canvas size to container size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Get and configure context
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    return { width: canvas.width, height: canvas.height };
  }, [canvasRef, contextRef]);

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef, contextRef]);

  // Draw line
  const drawLine = useCallback((x1, y1, x2, y2, color, width) => {
    if (!contextRef.current) return;

    const ctx = contextRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }, [contextRef]);

  // Draw rectangle
  const drawRectangle = useCallback((x1, y1, x2, y2, color, width) => {
    if (!contextRef.current) return;

    const ctx = contextRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }, [contextRef]);

  // Draw circle
  const drawCircle = useCallback((x1, y1, x2, y2, color, width) => {
    if (!contextRef.current) return;

    const ctx = contextRef.current;
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }, [contextRef]);

  // Draw text
  const drawText = useCallback((text, x, y, color, fontSize) => {
    if (!contextRef.current) return;

    const ctx = contextRef.current;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }, [contextRef]);

  // Save canvas snapshot
  const saveSnapshot = useCallback(() => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL();
  }, [canvasRef]);

  // Restore canvas snapshot
  const restoreSnapshot = useCallback((snapshot) => {
    if (!canvasRef.current || !contextRef.current || !snapshot) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const img = new Image();
    img.src = snapshot;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [canvasRef, contextRef]);

  return {
    initializeCanvas,
    getMousePos,
    clearCanvas,
    drawLine,
    drawRectangle,
    drawCircle,
    drawText,
    saveSnapshot,
    restoreSnapshot,
  };
};