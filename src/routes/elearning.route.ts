import express from 'express';
import { transcriptRouter } from './transcript.route';
import { calendarRouter } from './calendar.route';

export const elearningRouter = express.Router();

elearningRouter.use('/transcript', [transcriptRouter]);
elearningRouter.use('/calendar', [calendarRouter]);
