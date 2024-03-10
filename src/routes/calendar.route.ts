import express from 'express';
import {
  handleCreateCalendar,
  handleDeleteCalendar,
  handleGetCalendarByUserId,
  handleUpdateCalendar
} from '../controllers/calendar.controller';
export const calendarRouter = express.Router();

calendarRouter.get('/', handleGetCalendarByUserId);
calendarRouter.post('/', [handleCreateCalendar]);
calendarRouter.patch('/:calendarId', [handleUpdateCalendar]);
calendarRouter.delete('/:calendarId', [handleDeleteCalendar]);
