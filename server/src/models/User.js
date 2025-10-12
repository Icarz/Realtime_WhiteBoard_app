import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    socketId: {
      type: String,
      default: null,
    },
    currentRoom: {
      type: String,
      default: null,
    },
    cursorColor: {
      type: String,
      default: '#3B82F6', // Default blue color
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ socketId: 1 });
userSchema.index({ currentRoom: 1 });

// Method to update last seen
userSchema.methods.updateLastSeen = function () {
  this.lastSeen = Date.now();
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;