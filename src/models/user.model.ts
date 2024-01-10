import { Prisma } from '@prisma/client';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';
import { PostModel } from './post.model';

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
                avatar: true
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
                avatar: true
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
          avatar: follower.user_follow_follower_idTouser.avatar ?? null
        })),
        count: queryResult._count.follow_follow_followed_idTouser
      },
      userFolloweds: {
        user: queryResult.follow_follow_follower_idTouser.map((following) => ({
          uuid: following.user_follow_followed_idTouser.user_uuid,
          name: following.user_follow_followed_idTouser.name,
          avatar: following.user_follow_followed_idTouser.avatar ?? null
        })),
        count: queryResult._count.follow_follow_follower_idTouser
      }
    };

    return result;
  }

  static async getUserFolloweds(userId: number, limit = 10) {
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

        follow_follow_follower_idTouser: {
          take: limit,
          where: {
            deleted: false
          },
          include: {
            user_follow_followed_idTouser: {
              select: {
                id: true,
                name: true,
                user_uuid: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    if (queryResult === null) {
      return null;
    }
    const result = queryResult.follow_follow_follower_idTouser.map((following) => ({
      id: following.user_follow_followed_idTouser.id,
      name: following.user_follow_followed_idTouser.name,
      avatar: following.user_follow_followed_idTouser.avatar ?? null
    }));

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

  static async getFiendsLatestPosts(userId: number, take = 20) {
    const userFolloweds = await UserModel.getUserFolloweds(userId);
    if (!userFolloweds) {
      return null;
    }
    const promises = userFolloweds.map((followed) => {
      return PostModel.getUserPost(followed.id, userId);
    });

    const result = await Promise.allSettled(promises);

    const fulfilledPost = result
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result.status === 'fulfilled' ? result.value : []));

    const posts = fulfilledPost
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, take);

    return posts;
  }

  static async searchUser(name: string, take = 10) {
    const users = await prisma.user.findMany({
      where: {
        deleted: false,
        name: {
          search: name
        }
      },
      orderBy: {
        _relevance: {
          fields: ['name'],
          search: name,
          sort: 'asc'
        }
      },
      take: take
    });

    const mapUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        birthday: user.birthday,
        sex: user.sex,
        createAt: user.create_at
      };
    });

    return mapUsers;
  }
}
