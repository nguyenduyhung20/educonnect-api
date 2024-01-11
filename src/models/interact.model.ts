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

  static async create(input: Pick<Prisma.interactCreateInput, 'type'>, userId: number, postId: number) {
    const interact = await prisma.interact.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId
        }
      }
    });

    if (!interact) {
      return await prisma.interact.create({
        data: {
          type: input.type,
          user_id: userId,
          post_id: postId
        }
      });
    }

    if (interact.type == input.type) {
      return await prisma.interact.update({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId
          }
        },
        data: {
          deleted: !interact.deleted
        }
      });
    } else {
      return await prisma.interact.update({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId
          }
        },
        data: {
          type: input.type
        }
      });
    }
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
