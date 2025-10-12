import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4().slice(0, 8), // Short room ID
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      minlength: [2, 'Room name must be at least 2 characters'],
      maxlength: [50, 'Room name cannot exceed 50 characters'],
    },
    createdBy: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    maxUsers: {
      type: Number,
      default: 20,
      min: [2, 'Room must allow at least 2 users'],
      max: [50, 'Room cannot exceed 50 users'],
    },
    currentUsers: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      default: null, // For private rooms
    },
    settings: {
      allowDrawing: {
        type: Boolean,
        default: true,
      },
      allowShapes: {
        type: Boolean,
        default: true,
      },
      allowText: {
        type: Boolean,
        default: true,
      },
      allowErase: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries

roomSchema.index({ isActive: 1, isPublic: 1 });
roomSchema.index({ createdAt: -1 });

// Virtual for checking if room is full
roomSchema.virtual('isFull').get(function () {
  return this.currentUsers >= this.maxUsers;
});

// Method to increment user count
roomSchema.methods.addUser = function () {
  if (this.currentUsers < this.maxUsers) {
    this.currentUsers += 1;
    return this.save();
  }
  throw new Error('Room is full');
};

// Method to decrement user count
roomSchema.methods.removeUser = function () {
  if (this.currentUsers > 0) {
    this.currentUsers -= 1;
    return this.save();
  }
  return this;
};

const Room = mongoose.model('Room', roomSchema);

export default Room;