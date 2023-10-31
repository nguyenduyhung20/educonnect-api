import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

export class UserModel {
  static async getAll(limit = 20) {
    return prisma.user.findMany({
      take: limit,
      where: {
        deleted: false
      },
      orderBy: {
        create_at: 'desc'
      }
    });
  }

  static async getById(id: number) {
    return prisma.user.findFirst({
      where: {
        id: id,
        deleted: false
      }
    });
  }

  static async getByUuid(uuid: string) {
    return prisma.user.findFirst({
      where: {
        user_uuid: uuid,
        deleted: false
      }
    });
  }

  static async create(data: Prisma.userCreateInput) {
    return prisma.user.create({
      data
    });
  }

  static async update(id: number, data: Prisma.userUpdateInput) {
    return prisma.user.update({
      where: { id: id },
      data
    });
  }

  static async delete(id: number) {
    return prisma.user.update({
      where: { id: id },
      data: { deleted: true }
    });
  }
}
