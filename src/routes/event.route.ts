import express from 'express';
import { handleReceiveUserEvent } from '../controllers/event.controller';

export const eventRouter = express.Router();

eventRouter.post('/', handleReceiveUserEvent);
