import express from 'express';
import { testRouter } from './test.route';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';
import { postRouter } from './post.route';
import { publicRouter } from './public.route';
import { elearningRouter } from './elearning.route';
import verifyJWT from '../middleware/verifyJWT';
import { searchRouter } from './search.route';
import { verifyUser } from '../middleware/user.middleware';
import { exploreRouter } from './explore.route';
import { eventRouter } from './event.route';

const router = express.Router();

router.use('/v1/test', testRouter);
router.use('/v1/auth', authRouter);
router.use('/v1/search', searchRouter);
router.use('/v1/public', publicRouter);
router.use('/v1/user', [verifyJWT, userRouter]);
router.use('/v1/group', [verifyJWT, verifyUser, groupRouter]);
router.use('/v1/post', [verifyJWT, verifyUser, postRouter]);
router.use('/v1/explore', [verifyJWT, verifyUser, exploreRouter]);
router.use('/v1/elearning', [verifyJWT, elearningRouter]);
router.use('v1/event', [verifyJWT, verifyUser, eventRouter]);

export default router;
