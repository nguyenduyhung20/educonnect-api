import express from 'express';
import { testRouter } from './test.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';
import { postRouter } from './post.route';

const router = express.Router();

router.use('/test', testRouter);
router.use('/user', userRouter);
router.use('/group', groupRouter);
router.get('/post', postRouter);

export default router;
