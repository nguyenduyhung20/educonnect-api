import { NextFunction, Request, Response } from 'express';
import { CalendarModel } from '../models/calendar.model';

export const handleGetCalendarByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const calendar = await CalendarModel.get(userId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateCalendar = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const calendarId = parseInt(req.params.calendarId);
  const data = req.body;

  try {
    const calendar = await CalendarModel.update(calendarId, userId, data);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteCalendar = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const calendarId = parseInt(req.params.calendarId);
  try {
    const calendar = await CalendarModel.delete(calendarId, userId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleCreateCalendar = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const data = req.body;
  try {
    const calendar = await CalendarModel.create(userId, data);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};
