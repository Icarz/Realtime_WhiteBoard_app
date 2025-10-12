import cors from 'cors';
import { CONFIG } from '../config/constants.js';

const corsOptions = {
  origin: CONFIG.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);