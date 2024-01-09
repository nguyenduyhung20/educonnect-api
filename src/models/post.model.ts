import { Prisma } from '@prisma/client';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';

const InteractCountInclude: Pick<Prisma.postSelect, '_count'> = {
  _count: {
    select: {
      interact: {
        where: {
          deleted: false
        }
      },
      other_post: {
        where: {
          deleted: false
        }
      }
    }
  }
};

const COMMENT_SELECT: Prisma.postSelect = {
  id: true,
  title: true,
  content: true,
  create_at: true,
  post_uuid: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true
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
  select: typeof COMMENT_SELECT;
}>;

type RawPostWithComment = Prisma.postGetPayload<{
  select: typeof POST_WITH_COMMENT_SELECT;
}>;

const mapComment = (post: RawComment) => {
  const result = {
    id: post.id,
    user: post.user,
    title: post.title,
    content: post.content,
    createdAt: post.create_at,
    parentPostId: post.post?.id ?? undefined,
    interactCount: post._count.interact,
    commentCount: post._count.other_post
  };
  return result;
};

const mapPost = (post: RawPost) => {
  const result = {
    ...mapComment(post)
  };
  return result;
};

const mapPostWithComment = (post: RawPostWithComment) => {
  const result = {
    ...mapComment(post),
    comment: post.other_post.map((comment: any) => mapComment(comment))
  };
  return result;
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
    const result = await prisma.post.findFirst({
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
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const mappedPost = mapPostWithComment(result);
    return mappedPost;
  }

  static async getByUuid(uuid: string, commentLimit = 10) {
    const result = await prisma.post.findFirst({
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
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const mappedPost = mapPost(result);
    return mappedPost;
  }

  static async getUserPost(userId: number, postLimit = 10) {
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
            ...COMMENT_SELECT
          }
        }
      }
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const mappedResult = result.post.map((post) => mapPost(post));

    return mappedResult;
  }

  static async getUserPostWithComment(userId: number, postLimit = 10, commentLimit = 10) {
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
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const mappedResult = result.post.map((post) => mapPostWithComment(post));
    return mappedResult;
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
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.post.map((post) => mapPost(post));

    return mappedResult;
  }

  static async getHotPosts(postLimit = 20, commentLimit = 5) {
    const queryResult = await prisma.post.findMany({
      take: postLimit,
      orderBy: {
        create_at: 'desc'
      },
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
      }
    });
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.map((post) => mapPost(post));

    return mappedResult;
  }

  static async create(userId: number, input: Prisma.postCreateInput) {
    return prisma.post.create({
      data: {
        title: input.title,
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

  static async createComment(userId: number, parentPostId: number, input: Prisma.postCreateInput) {
    return prisma.post.create({
      data: {
        content: input.content,
        user_id: userId,
        parent_post_id: parentPostId
      }
    });
  }

  static async searchPost(text: string, take = 10) {
    const posts = await prisma.post.findMany({
      where: {
        title: {
          search: text
        },
        content: {
          search: text
        },
        parent_post_id: null,
        deleted: false
      },
      select: COMMENT_SELECT,
      orderBy: {
        _relevance: {
          fields: ['title', 'content'],
          search: text,
          sort: 'asc'
        }
      },
      take: take
    });

    const mapPosts = posts.map((post) => mapPost(post));

    return mapPosts;
  }
}
