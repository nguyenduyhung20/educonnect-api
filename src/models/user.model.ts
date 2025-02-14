import { Prisma } from '@prisma/client';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';
import { PostService } from '../services/post.service';

export class UserModel {
  static async changeAvatar(userId: number, image: string) {
    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: image
      }
    });
  }
  static async changeBackground(userId: number, image: string) {
    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        background: image
      }
    });
  }

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

  static async updatePointById(userId: number, point: number) {
    const currentPoint = await prisma.user.findFirst({
      select: {
        point: true
      },
      where: {
        id: userId
      }
    });
    const newPoint = currentPoint?.point ?? 0 + point;
    return prisma.user.update({
      data: {
        point: newPoint
      },
      where: {
        id: userId
      }
    });
  }

  static async getById(id: number) {
    const results = await prisma.user.findFirst({
      where: {
        id: id,
        deleted: false
      }
    });
    return results
      ? {
          ...results,
          avatar: results?.avatar?.startsWith('http')
            ? results.avatar
            : process.env.NEXT_PUBLIC_API_HOST + (results?.avatar ?? ''),
          background: results?.background?.startsWith('http')
            ? results.background
            : process.env.NEXT_PUBLIC_API_HOST + (results?.background ?? '')
        }
      : null;
  }

  static async getAdminById(id: number) {
    return prisma.admin.findUnique({
      where: {
        id: id,
        deleted: false
      }
    });
  }

  static async getParentById(id: number) {
    return prisma.parent.findFirst({
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

  static async createAccount(data: any) {
    return prisma.account.create({
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
                id: true,
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

    const result = {
      userFollowers: {
        user: queryResult.follow_follow_followed_idTouser.map((follower) => ({
          id: follower.user_follow_follower_idTouser.id,
          uuid: follower.user_follow_follower_idTouser.user_uuid,
          name: follower.user_follow_follower_idTouser.name,
          avatar: follower.user_follow_follower_idTouser.avatar
            ? follower.user_follow_follower_idTouser.avatar?.startsWith('http')
              ? follower.user_follow_follower_idTouser.avatar
              : process.env.NEXT_PUBLIC_API_HOST + (follower.user_follow_follower_idTouser.avatar ?? '')
            : null
        })),
        count: queryResult._count.follow_follow_followed_idTouser
      },
      userFolloweds: {
        user: queryResult.follow_follow_follower_idTouser.map((following) => ({
          id: following.user_follow_followed_idTouser.id,
          uuid: following.user_follow_followed_idTouser.user_uuid,
          name: following.user_follow_followed_idTouser.name,
          avatar: following.user_follow_followed_idTouser.avatar
            ? following.user_follow_followed_idTouser.avatar?.startsWith('http')
              ? following.user_follow_followed_idTouser.avatar
              : process.env.NEXT_PUBLIC_API_HOST + (following.user_follow_followed_idTouser.avatar ?? '')
            : null
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
      avatar: following.user_follow_followed_idTouser.avatar
        ? following.user_follow_followed_idTouser.avatar?.startsWith('http')
          ? following.user_follow_followed_idTouser.avatar
          : process.env.NEXT_PUBLIC_API_HOST + (following.user_follow_followed_idTouser.avatar ?? '')
        : null
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

  static async getFiendsLatestPosts(userId: number, take = 20) {
    const userFolloweds = await UserModel.getUserFolloweds(userId);
    if (!userFolloweds) {
      return null;
    }
    const promises = userFolloweds.map((followed) => {
      return PostService.getUserPosts({ userId: followed.id, userIdRequesting: userId, detail: false });
    });

    const result = await Promise.allSettled(promises);

    const fulfilledPost = result
      .filter((result) => result.status === 'fulfilled')
      .map((result) => (result.status === 'fulfilled' ? result.value : []));

    const posts = fulfilledPost.flat().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
        avatar: user.avatar?.startsWith('http') ? user.avatar : process.env.NEXT_PUBLIC_API_HOST + (user.avatar ?? ''),
        background: user.background?.startsWith('http')
          ? user.background
          : process.env.NEXT_PUBLIC_API_HOST + (user.background ?? ''),
        email: user.email,
        birthday: user.birthday,
        sex: user.sex,
        createAt: user.create_at
      };
    });

    return mapUsers;
  }

  static async getUserMostFollower() {
    const results = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        avatar: true,
        _count: {
          select: {
            follow_follow_followed_idTouser: {
              where: {
                deleted: false
              }
            }
          }
        }
      },
      where: {
        deleted: false
      },
      orderBy: {
        follow_follow_followed_idTouser: {
          _count: 'desc'
        }
      }
    });
    return results.map((item) => {
      return {
        id: item.id,
        name: item.name,
        avatar: item.avatar?.startsWith('http') ? item.avatar : process.env.NEXT_PUBLIC_API_HOST + (item.avatar ?? ''),
        followerCount: item._count.follow_follow_followed_idTouser
      };
    });
  }
}
