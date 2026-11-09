import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map(x => x.trim());
app.use(helmet());
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) callback(null, true); else callback(new Error('Origin not allowed')); } }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api', api);
app.use(notFound);
app.use(errorHandler);
export default app;
