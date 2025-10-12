export const CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  MAX_CANVAS_WIDTH: 4000,
  MAX_CANVAS_HEIGHT: 4000,
  DRAWING_THROTTLE_MS: 16, // ~60fps
};