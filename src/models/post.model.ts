import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

const InteractCountInclude = {
  _count: {
    select: {
      interact: {
        where: {
          deleted: false
        }
      }
    }
  }
};

const COMMENT_SELECT = {
  id: true,
  content: true,
  create_at: true,
  post_uuid: true,
  user: {
    select: {
      user_uuid: true
    }
  },
  post: {
    where: {
      deleted: false
    }
  },
  ...InteractCountInclude
};

const POST_WITH_COMMENT_SELECT = {
  ...COMMENT_SELECT,
  other_post: {
    select: COMMENT_SELECT
  }
};

type RawComment = Prisma.postGetPayload<{
  select: typeof COMMENT_SELECT;
}>;

type RawPost = Prisma.postGetPayload<{
  select: typeof POST_WITH_COMMENT_SELECT;
}>;

export const mapComment = (post: RawComment) => {
  return {
    content: post.content,
    createdAt: post.create_at,
    postUuid: post.post_uuid,
    parentPostUuid: post.post?.post_uuid ?? null,
    interactCount: post._count.interact
  };
};

export const mapPost = (post: RawPost) => {
  return {
    ...mapComment(post),
    comments: post.other_post.map((comment: any) => mapComment(comment))
  };
};

export class PostModel {
  static async getAll(postLimit = 10, commentLimit = 10) {
    return prisma.post.findMany({
      take: postLimit,
      where: {
        parent_post_id: null,
        deleted: false
      },
      select: {
        ...COMMENT_SELECT,
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          select: COMMENT_SELECT,
          orderBy: {
            create_at: 'desc'
          }
        }
      },
      orderBy: {
        create_at: 'desc'
      }
    });
  }

  static async getById(id: number, commentLimit = 10) {
    return prisma.post.findFirst({
      where: {
        id: id,
        parent_post_id: null,
        deleted: false
      },
      select: {
        ...COMMENT_SELECT,
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          select: COMMENT_SELECT,
          orderBy: {
            create_at: 'desc'
          }
        }
      }
    });
  }

  static async getByUuid(uuid: string, commentLimit = 10) {
    return prisma.post.findFirst({
      where: {
        post_uuid: uuid,
        parent_post_id: null,
        deleted: false
      },
      select: {
        ...COMMENT_SELECT,
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          select: COMMENT_SELECT,
          orderBy: {
            create_at: 'desc'
          }
        }
      }
    });
  }

  static async getUserPost(userId: number, postLimit = 10, commentLimit = 10) {
    const result = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        post: {
          take: postLimit,
          where: {
            parent_post_id: null,
            group_id: null,
            deleted: false
          },
          select: {
            ...COMMENT_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: COMMENT_SELECT,
              orderBy: {
                create_at: 'desc'
              }
            }
          }
        }
      }
    });
    return result;
  }

  static async getGroupPosts(groupId: number, postLimit = 5, commentLimit = 5) {
    const queryResult = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      select: {
        post: {
          take: postLimit,
          orderBy: {
            create_at: 'desc'
          },
          where: {
            parent_post_id: null,
            group_id: groupId,
            deleted: false
          },
          select: {
            ...COMMENT_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: COMMENT_SELECT,
              orderBy: {
                create_at: 'desc'
              }
            }
          }
        }
      }
    });
    return queryResult;
  }

  static async create(userId: number, input: Prisma.postCreateInput) {
    return prisma.post.create({
      data: {
        content: input.content,
        user_id: userId
      }
    });
  }

  static async update(id: number, data: Prisma.postUpdateInput) {
    return prisma.post.update({
      where: { id: id, parent_post_id: null },
      data
    });
  }

  static async delete(userId: number, postId: number) {
    return prisma.post.update({
      where: { id: postId, user_id: userId, parent_post_id: null },
      data: { deleted: true }
    });
  }
}
