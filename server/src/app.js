import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/validation.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import roomRoutes from './routes/roomRoutes.js';
import drawingRoutes from './routes/drawingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import monitorRoutes from './routes/monitorRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/drawings', drawingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/monitor', monitorRoutes); 

// Add this route (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', debugRoutes);
}

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;