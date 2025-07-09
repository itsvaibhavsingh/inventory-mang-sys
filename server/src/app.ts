import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import rootRouter from './routes';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorhandler';

const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));

// ✅ Correctly configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://inventory-managment-system-omega.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// application routes
app.use('/api/v1', rootRouter);

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFound);

export default app;