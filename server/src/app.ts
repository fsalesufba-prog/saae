import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
    origin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN || 'https://saaelinhares.com.br'),
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', limiter);
app.use('/api', routes);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

export default app;