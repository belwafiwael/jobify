import * as dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';
dotenv.config();
const port = process.env.PORT || 5100;
const app = express();
// Routes
import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
// Public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json())
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('', (req, res) => {
    console.log(req);
    res.json({ message: 'Data received', data: req.body });
})
app.get('/api/v1/test', (req, res) => {
  res.json({msg: 'test route'})
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/jobs', authenticateUser,jobRouter)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './public')));

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
});
app.use(errorHandlerMiddleware);

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server  running on PORT ${port}....`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
