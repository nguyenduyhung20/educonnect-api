import prisma from '../databases/client';

export class NotificationModel {
  static async create(data: { userId: number; message: string }) {
    return await prisma.notification.create({
      data: {
        user_id: data.userId,
        message: data.message
      }
    });
  }
}
