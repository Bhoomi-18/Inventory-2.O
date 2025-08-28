import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import dbManager from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(generalLimiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const gracefulShutdown = async (): Promise<void> => {
  console.log('Received shutdown signal. Graceful shutdown...');
  
  try {
    await dbManager.closeAllConnections();
    console.log('All database connections closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  gracefulShutdown();
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

export default app;