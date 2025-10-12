import api from './api';

export const drawingService = {
  // Get drawing history
  getDrawingHistory: async (roomId) => {
    const response = await api.get(`/api/drawings/${roomId}`);
    return response;
  },

  // Save drawing action
  saveDrawingAction: async (roomId, action) => {
    const response = await api.post(`/api/drawings/${roomId}/actions`, { action });
    return response;
  },

  // Clear drawing
  clearDrawing: async (roomId, userId) => {
    const response = await api.delete(`/api/drawings/${roomId}`, {
      body: JSON.stringify({ userId }),
    });
    return response;
  },

  // Undo action
  undoAction: async (roomId, actionId) => {
    const response = await api.delete(`/api/drawings/${roomId}/actions/${actionId}`);
    return response;
  },

  // Export drawing
  exportDrawing: async (roomId) => {
    const response = await api.get(`/api/drawings/${roomId}/export`);
    return response;
  },
};