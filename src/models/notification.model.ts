import prisma from '../databases/client';

export class NotificationModel {
  static async create(data: { senderId: number; receiverId: number; message: string; item_id: number }) {
    return await prisma.notification.create({
      data: {
        sender_id: data.senderId,
        receiver_id: data.receiverId,
        message: data.message,
        item_id: data.item_id
      }
    });
  }

  static async getNotifications(userId: number, limit = 10) {
    const result = await prisma.notification.findMany({
      // take: limit,
      where: {
        receiver_id: userId
      },
      orderBy: {
        create_at: 'desc'
      },
      select: {
        message: true,
        create_at: true,
        user_notification_sender_idTouser: {
          select: {
            id: true,
            avatar: true,
            is_famous: true,
            name: true
          }
        },
        item_id: true,
        is_read: true,
        id: true
      }
    });
    return result.map((item) => {
      return {
        message: item.message,
        createdAt: item.create_at,
        user: item.user_notification_sender_idTouser,
        itemId: item.item_id,
        isRead: item.is_read,
        id: item.id
      };
    });
  }

  static async updateIsRead(id: number) {
    return prisma.notification.update({
      data: {
        is_read: true
      },
      where: {
        id: id
      }
    });
  }
}
