import express from 'express';
import { testRouter } from './test.route';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';
import { postRouter } from './post.route';
import verifyJWT from '../middleware/verifyJWT';
import { searchRouter } from './search.route';

const router = express.Router();

router.use('/v1/test', testRouter);
router.use('/v1/auth', authRouter);
router.use('/v1/search', searchRouter);
router.use('/v1/user', [verifyJWT, userRouter]);
router.use('/v1/group', [verifyJWT, groupRouter]);
router.use('/v1/post', [verifyJWT, postRouter]);

export default router;
