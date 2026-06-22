import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './Configs/db.js';
import AuthRouter from './Routes/AuthRoutes.js';
import componentRouter from './Routes/ComponentRoutes.js';
import userRouter from './Routes/UserRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

connectDB();

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(cookieParser());
app.use('/api/auth', AuthRouter);
app.use('/api/component', componentRouter);
app.use('/api/user', userRouter);

// Only listen when not in serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
  });
}

export default app;



