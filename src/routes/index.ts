import userRouter from './users.ts';
import roomRouter from './rooms.ts';
import { Router } from 'express';

export const router = Router();

router.use('/users', userRouter);
router.use('/rooms', roomRouter);

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});
