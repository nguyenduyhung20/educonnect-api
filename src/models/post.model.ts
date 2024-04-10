import { Prisma } from '@prisma/client';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';
import { GetPostsByListIdInput } from '../interfaces/type';

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

export const POST_SELECT = {
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
      avatar: true,
      is_famous: true
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
} as const;

type RawComment = Prisma.postGetPayload<{
  select: typeof POST_SELECT;
}>;

type RawPost = Prisma.postGetPayload<{
  select: typeof POST_SELECT;
}>;

const mapComment = (post: RawComment) => {
  const result = {
    id: post.id,
    user: {
      ...post.user,
      avatar: post.user.avatar?.startsWith('http')
        ? post.user.avatar
        : process.env.NEXT_PUBLIC_API_HOST + (post.user.avatar ?? '')
    },
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

export const mapPost = (post: RawPost) => {
  const result = {
    ...mapComment(post)
  };
  return result;
};

export class PostModel {
  static async getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList: number[], postLimit = 100) {
    const posts = await prisma.post.findMany({
      take: postLimit,
      where: {
        deleted: false,
        id: {
          in: postIdNumberList
        }
      },
      select: {
        group: {
          select: {
            id: true,
            title: true
          }
        },
        id: true,
        title: true,
        create_at: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        post_summarization: {
          select: {
            content_summarization: true
          }
        },
        other_post: {
          where: {
            deleted: false
          },
          select: {
            ...POST_SELECT,
            other_post: {
              where: {
                deleted: false
              },
              select: {
                ...POST_SELECT,
                interact: {
                  where: {
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
                deleted: false
              },
              select: {
                type: true
              }
            }
          },
          orderBy: {
            create_at: 'asc'
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
      }
    });
    const mapPosts = posts.map((item) => {
      const mappedPost = {
        id: item.id,
        title: item.title,
        user: {
          ...item.user,
          avatar: item.user.avatar?.startsWith('http')
            ? item.user.avatar
            : process.env.NEXT_PUBLIC_API_HOST + (item.user.avatar ?? '')
        },
        contentSummarization: item.post_summarization?.content_summarization,
        createAt: item.create_at,
        commentCount: item._count.other_post,
        interactCount: item._count.interact,
        group: item.group ?? null,
        comment: item.other_post.map((comment) => ({
          id: comment.id,
          user: {
            ...comment.user,
            avatar: comment.user.avatar?.startsWith('http')
              ? comment.user.avatar
              : process.env.NEXT_PUBLIC_API_HOST + (comment.user.avatar ?? '')
          },
          title: comment.title,
          content: comment.content,
          parentPostId: comment.post?.id ?? undefined,
          commentCount: comment._count.other_post,
          interactCount: comment._count.interact,
          userInteract: comment.interact[0]?.type ?? null,
          createdAt: comment.create_at
        }))
      };
      let sumCommentCount = mappedPost.commentCount;

      mappedPost.comment.forEach((item) => {
        sumCommentCount += item.commentCount;
      });
      return { ...mappedPost, commentCount: sumCommentCount };
    });
    return mapPosts;
  }

  static async getPostsByListId<T extends Prisma.postSelect>({ args, select }: GetPostsByListIdInput<T>) {
    const { postIdList } = args;

    const result = await prisma.post.findMany({
      where: {
        deleted: false,
        id: {
          in: postIdList
        }
      },
      select
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return result;
  }

  static async getById(id: number, userIdRequesting: number, type: 'post' | 'comment', commentLimit = 100) {
    const postTypeWhereCondition =
      type == 'post'
        ? {
            id: id,
            parent_post_id: null,
            deleted: false
          }
        : {
            id: id,
            deleted: false
          };

    const result = await prisma.post.findFirst({
      where: postTypeWhereCondition,
      select: {
        ...POST_SELECT,
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          select: {
            ...POST_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: {
                ...POST_SELECT,
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
            create_at: 'asc'
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
        group: {
          select: {
            id: true,
            title: true
          }
        },
        post_topic: {
          select: {
            topic_id: true
          }
        }
      }
    });
    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    return result;
  }

  static async getPostsByUserId(userId: number, userIdRequesting: number) {
    const result = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        post: {
          where: {
            parent_post_id: null,
            deleted: false
          },
          select: {
            ...POST_SELECT,
            other_post: {
              where: {
                deleted: false
              },
              select: {
                ...POST_SELECT,
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
            },
            group: {
              select: {
                id: true,
                title: true
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

  static async getPostWithCommentByUserId(userId: number, userIdRequesting: number, postLimit = 30, commentLimit = 10) {
    const result = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        post: {
          take: postLimit,
          where: {
            parent_post_id: null,
            deleted: false
          },
          select: {
            ...POST_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: {
                ...POST_SELECT,
                other_post: {
                  take: commentLimit,
                  where: {
                    deleted: false
                  },
                  select: {
                    ...POST_SELECT,
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
            group: {
              select: {
                id: true,
                title: true
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
            ...POST_SELECT,
            other_post: {
              take: commentLimit,
              where: {
                deleted: false
              },
              select: {
                ...POST_SELECT,
                other_post: {
                  take: commentLimit,
                  where: {
                    deleted: false
                  },
                  select: {
                    ...POST_SELECT,
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

  static async getHotPostsForPublic(postLimit = 20) {
    const queryResult = await prisma.post.findMany({
      take: postLimit,
      orderBy: {
        interact: { _count: 'desc' }
      },
      where: {
        parent_post_id: null,
        group_id: null,
        deleted: false
      },
      select: {
        ...POST_SELECT
      }
    });
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.map((post) => {
      return {
        ...mapPost(post),
        fileContent: post.file_content.map((item) => {
          return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
        })
      };
    });

    return mappedResult;
  }

  static async create(userId: number, input: Prisma.postCreateInput, uploadedFiles: string[], groupId: string | null) {
    return prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        user_id: userId,
        file_content: uploadedFiles,
        group_id: groupId ? parseInt(groupId, 10) : null
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
    const result = await prisma.post.create({
      data: {
        content: input.content,
        user_id: userId,
        parent_post_id: parentPostId
      }
    });
    const user = await prisma.user.findFirst({
      where: {
        id: result.user_id
      },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });
    return {
      commentCount: 0,
      content: result.content,
      createdAt: result.create_at,
      id: result.id,
      interactCount: 0,
      title: result.title,
      user: user ?? null,
      userInteract: null
    };
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
      select: POST_SELECT,
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

  static async getHotPostByUserID(userId: number) {
    const queryResult = await prisma.post.findMany({
      orderBy: { create_at: 'desc' },
      where: {
        parent_post_id: null,
        deleted: false
      },
      select: {
        ...POST_SELECT,
        other_post: {
          where: {
            deleted: false
          },
          select: POST_SELECT,
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
        },
        group: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.map((post) => {
      return {
        ...mapPost(post),
        userInteract: post.interact[0]?.type ?? null,
        fileContent: post.file_content.map((item) => {
          return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
        }),
        group: post.group ?? null
      };
    });

    return mappedResult;
  }

  static async getMostInteractPost(postLimit: number = 30) {
    const queryResult = await prisma.post.findMany({
      take: postLimit,
      where: {
        parent_post_id: null,
        deleted: false
      },
      select: {
        ...POST_SELECT,
        group: {
          select: {
            id: true,
            title: true
          }
        },
        post_summarization: {
          where: {
            deleted: false
          },
          select: {
            content_summarization: true
          }
        }
      },
      orderBy: {
        interact: { _count: 'desc' }
      }
    });

    if (!queryResult) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = queryResult.map((post) => {
      return {
        id: post.id,
        user: post.user,
        title: post.title,
        content: post.content,
        parentPostId: post.post?.id ?? undefined,
        commentCount: post._count.other_post,
        interactCount: post._count.interact,
        createdAt: post.create_at instanceof Date ? post.create_at.toISOString() : post.create_at,
        group: post.group ?? undefined,
        content_summarization: post.post_summarization?.content_summarization ?? undefined
      };
    });

    return mappedResult;
  }
}
