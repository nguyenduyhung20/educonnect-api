import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

export class CalendarModel {
  static async get(userId: number) {
    return prisma.calendar.findMany({
      where: {
        user_id: userId,
        deleted: false
      }
    });
  }

  static async delete(id: number, userId: number) {
    return prisma.calendar.update({
      where: { id: id, user_id: userId },
      data: {
        deleted: true
      }
    });
  }

  static async update(id: number, userId: number, data: Prisma.calendarCreateInput) {
    return prisma.calendar.update({
      where: { id: id, user_id: userId },
      data: {
        title: data.title,
        calendarId: data.calendarId,
        category: data.category,
        start: data.start,
        location: data.location,
        state: data.state,
        end: data.end
      }
    });
  }

  static async create(userId: number, data: Prisma.calendarCreateInput) {
    return await prisma.calendar.create({
      data: {
        title: data.title,
        calendarId: data.calendarId,
        category: data.category,
        start: data.start,
        end: data.end,
        location: data.location,
        state: data.state,
        user_id: userId
      }
    });
  }
}
