import express from 'express';
import { testRouter } from './test.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';

const router = express.Router();

router.use('/test', testRouter);
router.use('/user', userRouter);
router.use('/group', groupRouter);

export default router;
