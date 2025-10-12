import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useRoom } from '@hooks/useRoom';
import { useCollaboration } from '@hooks/useCollaboration';
import Header from '@components/Common/Header';
import Loader from '@components/Common/Loader';

const WhiteboardRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentRoom, loading, error, fetchRoomById } = useRoom();
  const { handleJoinRoom, handleLeaveRoom } = useCollaboration(roomId);

  const [isJoining, setIsJoining] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const joinRoomAsync = async () => {
      const room = await fetchRoomById(roomId);
      if (room) {
        handleJoinRoom();
        setIsJoining(false);
      } else {
        navigate('/');
      }
    };

    joinRoomAsync();

    return () => {
      handleLeaveRoom();
    };
  }, [roomId, isAuthenticated, navigate, fetchRoomById, handleJoinRoom, handleLeaveRoom]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading || isJoining) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader size="xl" text="Joining room..." />
        </div>
      </div>
    );
  }

  if (error || !currentRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Room Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error || 'The room you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentRoom.name}
          </h1>
          <p className="text-gray-600 mb-8">
            Whiteboard canvas will be integrated in Step 5
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500">Room ID: {roomId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardRoom;