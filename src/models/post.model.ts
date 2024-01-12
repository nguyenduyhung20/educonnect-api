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

const COMMENT_SELECT = {
  id: true,
  title: true,
  content: true,
  create_at: true,
  post_uuid: true,
  file_content: true,
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
    },
    select: {
      id: true
    }
  },
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

type RawComment = Prisma.postGetPayload<{
  select: typeof COMMENT_SELECT;
}>;

type RawPost = Prisma.postGetPayload<{
  select: typeof COMMENT_SELECT;
}>;

const mapComment = (post: RawComment) => {
  const result = {
    id: post.id,
    user: post.user,
    title: post.title,
    content: post.content,
    parentPostId: post.post?.id ?? undefined,
    commentCount: post._count.other_post,
    interactCount: post._count.interact,
    createdAt: post.create_at,
    fileContent: post.file_content
  };
  return result;
};

const mapPost = (post: RawPost) => {
  const result = {
    ...mapComment(post)
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

  static async getById(id: number, userIdRequesting: number, commentLimit = 10) {
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
          select: {
            ...COMMENT_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: {
                ...COMMENT_SELECT,
                interact: {
                  where: {
                    user_id: userIdRequesting,
                    deleted: false
                  },
                  select: {
                    type: true
                  }
                }
              }
            },
            interact: {
              where: {
                user_id: userIdRequesting,
                deleted: false
              },
              select: {
                type: true
              }
            }
          },
          orderBy: {
            create_at: 'desc'
          }
        },
        interact: {
          where: {
            user_id: userIdRequesting,
            deleted: false
          },
          select: {
            type: true
          }
        }
      }
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return result;
  }

  static async getPostsByUserId(userId: number, userIdRequesting: number, postLimit = 10) {
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
            interact: {
              where: {
                user_id: userIdRequesting,
                deleted: false
              },
              select: {
                type: true
              }
            }
          }
        }
      }
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return result;
  }

  static async getPostWithCommentByUserId(userId: number, userIdRequesting: number, postLimit = 10, commentLimit = 10) {
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
              select: {
                ...COMMENT_SELECT,
                other_post: {
                  take: commentLimit,
                  where: {
                    deleted: false
                  },
                  select: {
                    ...COMMENT_SELECT,
                    interact: {
                      where: {
                        user_id: userIdRequesting,
                        deleted: false
                      },
                      select: {
                        type: true
                      }
                    },
                    ...InteractCountInclude
                  }
                },
                interact: {
                  where: {
                    user_id: userIdRequesting,
                    deleted: false
                  },
                  select: {
                    type: true
                  }
                },
                ...InteractCountInclude
              },
              orderBy: {
                create_at: 'desc'
              }
            },
            interact: {
              where: {
                user_id: userIdRequesting,
                deleted: false
              },
              select: {
                type: true
              }
            },
            ...InteractCountInclude
          }
        }
      }
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return result;
  }

  static async getPostsByGroupId(groupId: number, userIdRequesting: number, postLimit = 5, commentLimit = 5) {
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
              select: {
                ...COMMENT_SELECT,
                other_post: {
                  take: commentLimit,
                  where: {
                    deleted: false
                  },
                  select: {
                    ...COMMENT_SELECT,
                    interact: {
                      where: {
                        user_id: userIdRequesting,
                        deleted: false
                      },
                      select: {
                        type: true
                      }
                    },
                    ...InteractCountInclude
                  }
                },
                interact: {
                  where: {
                    user_id: userIdRequesting,
                    deleted: false
                  },
                  select: {
                    type: true
                  }
                },
                ...InteractCountInclude
              },
              orderBy: {
                create_at: 'desc'
              }
            },
            interact: {
              where: {
                user_id: userIdRequesting,
                deleted: false
              },
              select: {
                type: true
              }
            },
            ...InteractCountInclude
          }
        }
      }
    });
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return queryResult;
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

  static async create(userId: number, input: Prisma.postCreateInput, uploadedFiles: string[]) {
    return prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        user_id: userId,
        file_content: uploadedFiles
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

  static async getHotPostByUserID(userId: number, postLimit: number = 20, commentLimit: number = 5) {
    const queryResult = await prisma.post.findMany({
      take: postLimit,
      orderBy: { create_at: 'desc' },
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
        },
        interact: {
          where: {
            user_id: userId,
            deleted: false
          },
          select: {
            type: true
          }
        }
      }
    });
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.map((post) => {
      return { ...mapPost(post), userInteract: post.interact[0]?.type ?? null };
    });

    return mappedResult;
  }
}
