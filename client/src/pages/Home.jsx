import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useRoom } from '@hooks/useRoom';
import Header from '@components/Common/Header';
import Loader from '@components/Common/Loader';
import Modal from '@components/Common/Modal';
import { Plus, Users, Clock, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const { rooms, loading, error, fetchRooms, createRoom } = useRoom();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      login(username.trim());
      setShowLoginModal(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const newRoom = await createRoom({
      name: roomName.trim(),
      createdBy: user.username,
      description: roomDescription.trim(),
    });

    if (newRoom) {
      navigate(`/room/${newRoom.roomId}`);
    }
  };

  const handleJoinRoom = (roomId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-time Collaborative Whiteboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create or join a room to start drawing together in real-time
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Room
          </button>
        </div>

        {/* Rooms List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Rooms
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading rooms..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                No rooms available. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  {room.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {room.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {room.currentUsers}/{room.maxUsers}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRoom(room.roomId)}
                    disabled={room.currentUsers >= room.maxUsers}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Join Room
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => !isAuthenticated && setShowLoginModal(false)}
        title="Enter Your Name"
        size="sm"
      >
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              minLength={2}
              maxLength={30}
              required
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </form>
      </Modal>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Room"
        size="md"
      >
        <form onSubmit={handleCreateRoom}>
          <div className="mb-4">
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Room Name *
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              minLength={2}
              maxLength={50}
              required
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="roomDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="roomDescription"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              placeholder="Enter room description"
              maxLength={200}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Home;