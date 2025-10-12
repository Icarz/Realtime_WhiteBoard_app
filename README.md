# Real-time Collaborative Whiteboard

A full-stack MERN application for real-time collaborative drawing.
Features

✏️ Real-time collaborative drawing
🎨 Multiple drawing tools (pen, shapes, text)
👥 Multiple users per room
🔄 Live cursor tracking
💾 Persistent whiteboard state
📤 Export whiteboard as image

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Socket.io Client
- React Router

### Backend
- Node.js
- Express
- Socket.io
- MongoDB
- Mongoose

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd realtime-whiteboard

---

## ✅ **Step 1 Complete! Verification Checklist**

Run these commands to verify everything is set up:
```bash
# From root directory
cd client && npm install && cd ..
cd server && npm install && cd ..

# Check if servers can start (don't worry about MongoDB connection yet)
cd server && npm run dev
# Should see: "Server is listening..."

# In another terminal
cd client && npm run dev
# Should see: "Local: http://localhost:3000"