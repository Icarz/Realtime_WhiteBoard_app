import { useState, useCallback } from 'react';
import { roomService } from '@services/roomService';

export const useRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all rooms
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rooms:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch room by ID
  const fetchRoomById = useCallback(async (roomId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await roomService.getRoomById(roomId);
      setCurrentRoom(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching room:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new room
  const createRoom = useCallback(async (roomData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await roomService.createRoom(roomData);
      setCurrentRoom(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating room:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rooms,
    currentRoom,
    loading,
    error,
    fetchRooms,
    fetchRoomById,
    createRoom,
    clearError,
  };
};