import api from './api';

export const roomService = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get('/api/rooms');
    return response;
  },

  // Get room by ID
  getRoomById: async (roomId) => {
    const response = await api.get(`/api/rooms/${roomId}`);
    return response;
  },

  // Create room
  createRoom: async (roomData) => {
    const response = await api.post('/api/rooms', roomData);
    return response;
  },

  // Update room
  updateRoom: async (roomId, updates) => {
    const response = await api.put(`/api/rooms/${roomId}`, updates);
    return response;
  },

  // Delete room
  deleteRoom: async (roomId) => {
    const response = await api.delete(`/api/rooms/${roomId}`);
    return response;
  },

  // Get room stats
  getRoomStats: async (roomId) => {
    const response = await api.get(`/api/rooms/${roomId}/stats`);
    return response;
  },
};