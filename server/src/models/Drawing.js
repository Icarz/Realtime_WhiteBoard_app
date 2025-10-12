import mongoose from 'mongoose';

const drawingActionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['draw', 'shape', 'text', 'erase', 'clear'],
    required: true,
  },
  tool: {
    type: String,
    enum: ['pen', 'rectangle', 'circle', 'line', 'text', 'eraser'],
    required: true,
  },
  coordinates: [
    {
      x: Number,
      y: Number,
    },
  ],
  color: {
    type: String,
    default: '#000000',
  },
  lineWidth: {
    type: Number,
    default: 2,
    min: 1,
    max: 50,
  },
  text: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const drawingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      ref: 'Room',
    },
    actions: [drawingActionSchema],
    totalActions: {
      type: Number,
      default: 0,
    },
    lastModifiedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
drawingSchema.index({ roomId: 1 });
drawingSchema.index({ updatedAt: -1 });

// Method to add drawing action
drawingSchema.methods.addAction = function (action) {
  this.actions.push(action);
  this.totalActions = this.actions.length;
  this.lastModifiedBy = action.userId;
  return this.save();
};

// Method to clear all actions
drawingSchema.methods.clearActions = function (userId) {
  this.actions = [];
  this.totalActions = 0;
  this.lastModifiedBy = userId;
  return this.save();
};

// Method to undo last action
drawingSchema.methods.undoAction = function (actionId) {
  this.actions = this.actions.filter(action => action.id !== actionId);
  this.totalActions = this.actions.length;
  return this.save();
};

// Static method to get or create drawing for room
drawingSchema.statics.getOrCreate = async function (roomId) {
  let drawing = await this.findOne({ roomId });
  if (!drawing) {
    drawing = await this.create({ roomId, actions: [] });
  }
  return drawing;
};

const Drawing = mongoose.model('Drawing', drawingSchema);

export default Drawing;