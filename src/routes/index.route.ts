import express from 'express';
import { testRouter } from './test.route';
import { userRouter } from './user.route';

const router = express.Router();

router.use('/test', testRouter);
router.use('/user', userRouter);

export default router;
