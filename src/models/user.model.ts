import { Prisma } from '@prisma/client';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';

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

  static async getFollowInfo(userId: number, limit = 20) {
    const queryResult = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        _count: {
          select: {
            follow_follow_followed_idTouser: {
              where: {
                deleted: false
              }
            },
            follow_follow_follower_idTouser: {
              where: {
                deleted: false
              }
            }
          }
        },
        follow_follow_followed_idTouser: {
          take: limit,
          where: {
            deleted: false
          },
          include: {
            user_follow_follower_idTouser: {
              select: {
                name: true,
                user_uuid: true,
                account: {
                  select: {
                    avatar: true
                  }
                }
              }
            }
          }
        },
        follow_follow_follower_idTouser: {
          take: limit,
          where: {
            deleted: false
          },
          include: {
            user_follow_followed_idTouser: {
              select: {
                name: true,
                user_uuid: true,
                account: {
                  select: {
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (queryResult === null) {
      return null;
    }

    const result = {
      userFollowers: {
        user: queryResult.follow_follow_followed_idTouser.map((follower) => ({
          uuid: follower.user_follow_follower_idTouser.user_uuid,
          name: follower.user_follow_follower_idTouser.name,
          avatar: follower.user_follow_follower_idTouser.account?.avatar ?? null
        })),
        count: queryResult._count.follow_follow_followed_idTouser
      },
      userFolloweds: {
        user: queryResult.follow_follow_follower_idTouser.map((following) => ({
          uuid: following.user_follow_followed_idTouser.user_uuid,
          name: following.user_follow_followed_idTouser.name,
          avatar: following.user_follow_followed_idTouser.account?.avatar ?? null
        })),
        count: queryResult._count.follow_follow_follower_idTouser
      }
    };

    return result;
  }

  static async followOther(userId: number, followedId: number) {
    const followRecord = await prisma.follow.findFirst({
      where: {
        follower_id: userId,
        followed_id: followedId
      },
      orderBy: {
        follow_times: 'desc'
      }
    });

    if (followRecord && followRecord.deleted === false) {
      throw new AppError(400, 'BAD_REQUEST');
    }

    const followTimes = followRecord ? followRecord.follow_times + 1 : 1;

    return prisma.follow.create({
      data: {
        follower_id: userId,
        followed_id: followedId,
        follow_times: followTimes
      }
    });
  }

  static async unfollowOther(userId: number, followedId: number) {
    const followRecord = await prisma.follow.findFirst({
      where: {
        follower_id: userId,
        followed_id: followedId
      },
      orderBy: {
        follow_times: 'desc'
      }
    });
    if (followRecord === null || followRecord.deleted === true) {
      throw new AppError(404, 'BAD_REQUEST');
    }

    return prisma.follow.update({
      where: {
        followed_id_follower_id_follow_times: {
          follower_id: userId,
          followed_id: followedId,
          follow_times: followRecord.follow_times
        }
      },
      data: {
        deleted: true
      }
    });
  }

  static async getNotifications(userId: number, limit = 10) {
    return prisma.notification.findMany({
      take: limit,
      where: {
        user_id: userId
      },
      orderBy: {
        create_at: 'desc'
      },
      select: {
        message: true,
        create_at: true
      }
    });
  }
}
