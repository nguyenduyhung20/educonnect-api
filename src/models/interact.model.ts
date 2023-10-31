import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

export class InteractModel {
  static async getAll(limit = 20) {
    return prisma.interact.findMany({
      take: limit,
      where: {
        deleted: false
      },
      orderBy: {
        create_at: 'desc'
      }
    });
  }

  static async getByPostId(id: number) {
    return prisma.interact.findMany({
      where: {
        post_id: id,
        deleted: false
      }
    });
  }

  static async create(data: Prisma.interactCreateInput) {
    return prisma.interact.create({
      data
    });
  }

  static async update(uid: number, pid: number, data: Prisma.interactUpdateInput) {
    return prisma.interact.updateMany({
      where: { post_id: pid, user_id: uid, deleted: false },
      data
    });
  }

  static async delete(uid: number, pid: number) {
    return prisma.interact.updateMany({
      where: { post_id: pid, user_id: uid, deleted: false },
      data: { deleted: true }
    });
  }
}
