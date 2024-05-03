import prisma from '../databases/client';

export class ReportPostModel {
  static create(postId: number, userId: number, reason: string, groupId?: number) {
    return prisma.post_reported.upsert({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId
        }
      },
      create: {
        post_id: postId,
        user_id: userId,
        group_id: groupId ?? null,
        reason: reason
      },
      update: {
        group_id: groupId ?? null,
        reason: reason,
        deleted: false
      }
    });
  }

  static async getAllReportPostGroup(groupId: number) {
    const result = await prisma.post_reported.findMany({
      where: {
        group_id: groupId,
        deleted: false
      },
      select: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                avatar: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reason: true
      }
    });
    return result.map((item) => {
      return {
        post: item.post,
        userReport: item.user,
        reason: item.reason
      };
    });
  }

  static async skipReportPostGroup(postId: number, userId: number) {
    return prisma.post_reported.update({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId
        }
      },
      data: {
        deleted: true
      }
    });
  }

  static deletePostReported(postId: number, groupId: number) {
    return prisma.post.update({
      where: {
        id: postId,
        group_id: groupId
      },
      data: {
        deleted: true
      }
    });
  }
}
