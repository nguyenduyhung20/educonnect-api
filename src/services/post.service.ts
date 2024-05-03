import { Prettify } from '../interfaces/type';
import { mapPost, POST_SELECT, PostModel } from '../models/post.model';
import { GetPostsByListIdArgs } from '../interfaces/type';
import { GetPostListConfig } from '../interfaces/type';

export class PostService {
  static async getPost({
    postId,
    userIdRequesting,
    type
  }: {
    postId: number;
    userIdRequesting: number;
    type: 'post' | 'comment';
  }) {
    const post = await PostModel.getById(postId, userIdRequesting, type);

    const mappedPost = {
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
      userInteract: post.interact[0]?.type ?? null,
      createdAt: post.create_at,
      fileContent: post.file_content.map((item) => {
        return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
      }),
      comment: post.other_post.map((comment) => ({
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
      })),
      topicList: post.post_topic.map((topic) => topic.topic_id)
    };

    let sumCommentCount = mappedPost.commentCount;

    mappedPost.comment.forEach((item) => {
      sumCommentCount += item.commentCount;
    });

    return { ...mappedPost, group: post.group ?? null, commentCount: sumCommentCount };
  }

  static async getUserPosts({
    userId,
    /**
     * User who started this request, for example user with id 2 is looking for user with id 3, so this field will be 2
     */
    userIdRequesting,
    detail
  }: {
    userId: number;
    userIdRequesting: number;
    detail: boolean;
  }) {
    if (detail === false) {
      const result = await PostModel.getPostsByUserId(userId, userIdRequesting);

      const mappedResult = result.post.map((post) => {
        const mappedPost = {
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
          userInteract: post.interact[0]?.type ?? null,
          createdAt: post.create_at,
          fileContent: post.file_content.map((item) => {
            return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
          }),
          comment: post.other_post.map((comment) => ({
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
          })),
          group: post.group ?? null
        };

        let sumCommentCount = mappedPost.commentCount;

        mappedPost.comment.forEach((item) => {
          sumCommentCount += item.commentCount;
        });

        return { ...mappedPost, commentCount: sumCommentCount };
      });

      return mappedResult;
    } else {
      const result = await PostModel.getPostWithCommentByUserId(userId, userIdRequesting);
      const mappedResult = result.post.map((post) => {
        const mappedPost = {
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
          userInteract: post.interact[0]?.type ?? null,
          createdAt: post.create_at,
          fileContent: post.file_content.map((item) => {
            return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
          }),
          group: post.group ?? null,
          comment: post.other_post.map((comment) => ({
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
            createdAt: comment.create_at,
            comment: comment.other_post.map((subComment) => ({
              id: subComment.id,
              user: {
                ...subComment.user,
                avatar: subComment.user.avatar?.startsWith('http')
                  ? subComment.user.avatar
                  : process.env.NEXT_PUBLIC_API_HOST + (subComment.user.avatar ?? '')
              },
              title: subComment.title,
              content: subComment.content,
              parentPostId: subComment.post?.id ?? undefined,
              commentCount: subComment._count.other_post,
              interactCount: subComment._count.interact,
              userInteract: subComment.interact[0]?.type ?? null,
              createdAt: subComment.create_at
            }))
          }))
        };
        return mappedPost;
      });
      return mappedResult;
    }
  }

  static async getGroupPosts({ groupId, userIdRequesting }: { groupId: number; userIdRequesting: number }) {
    const result = await PostModel.getPostsByGroupId(groupId, userIdRequesting);
    const mappedResult = result.post.map((post) => {
      const mappedPost = {
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
        userInteract: post.interact[0]?.type ?? null,
        createdAt: post.create_at,
        fileContent: post.file_content.map((item) => {
          return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
        }),
        group: post.group,
        comment: post.other_post.map((comment) => ({
          id: comment.id,
          user: comment.user,
          title: comment.title,
          content: comment.content,
          parentPostId: comment.post?.id ?? undefined,
          commentCount: comment._count.other_post,
          interactCount: comment._count.interact,
          userInteract: comment.interact[0]?.type ?? null,
          createdAt: comment.create_at,
          comment: comment.other_post.map((subComment) => ({
            id: subComment.id,
            user: {
              ...subComment.user,
              avatar: subComment.user.avatar?.startsWith('http')
                ? subComment.user.avatar
                : process.env.NEXT_PUBLIC_API_HOST + (subComment.user.avatar ?? '')
            },
            title: subComment.title,
            content: subComment.content,
            parentPostId: subComment.post?.id ?? undefined,
            commentCount: subComment._count.other_post,
            interactCount: subComment._count.interact,
            userInteract: subComment.interact[0]?.type ?? null,
            createdAt: subComment.create_at
          }))
        }))
      };
      let sumCommentCount = mappedPost.commentCount;

      mappedPost.comment.forEach((item) => {
        sumCommentCount += item.commentCount;
      });

      return { ...mappedPost, commentCount: sumCommentCount };
    });
    return mappedResult;
  }

  /**
   * Function to retrieve posts based on the provided ID list.
   * @param args All config options are defaulted to true: isComment, isGroup, isFileContent, isSummarize
   * @returns An array of posts modified based on the provided configuration.
   */
  static async getPostsList(args: Prettify<GetPostsByListIdArgs & GetPostListConfig>) {
    const {
      isComment = true,
      isGroup = true,
      isFileContent = true,
      isSummarize = true,
      commentLimit,
      userIdRequesting
    } = args;

    const selectUserOfPost = {
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
    } as const;

    const selectCommentOfPost = {
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
      }
    } as const;

    const selectGroupOfPost = {
      group: {
        select: {
          id: true,
          title: true
        }
      }
    };

    const selectSummarizeOfPost = {
      post_summarization: {
        select: {
          content_summarization: true
        }
      }
    };

    // Only post get return, add more cases as you like
    if (!isComment && !isGroup && !isSummarize) {
      const select = {
        ...selectUserOfPost
      };
      const result = await PostModel.getPostsByListId({ args, select });
      const mappedResult = result.map((post) => {
        return {
          ...mapPost(post),
          userInteract: post.interact[0]?.type ?? null,
          fileContent: isFileContent
            ? post.file_content.map((item) => {
                return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
              })
            : undefined
        };
      });
      return mappedResult;
    }

    if (!isComment && !isSummarize) {
      const select = {
        ...selectUserOfPost,
        ...selectGroupOfPost
      };
      const result = await PostModel.getPostsByListId<typeof select>({ args, select });
      const mappedResult = result.map((post) => {
        return {
          ...mapPost(post),
          userInteract: post.interact[0]?.type ?? null,
          fileContent: isFileContent
            ? post.file_content.map((item) => {
                return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
              })
            : undefined,
          group: isGroup ? post.group : undefined
        };
      });
      return mappedResult;
    }

    // Base case
    const select = {
      ...selectUserOfPost,
      ...selectCommentOfPost,
      ...selectGroupOfPost,
      ...selectSummarizeOfPost
    };
    const result = await PostModel.getPostsByListId<typeof select>({ args, select });
    const mappedResult = result.map((post) => {
      return {
        ...mapPost(post),
        userInteract: post.interact[0]?.type ?? null,
        comment: isComment
          ? post.other_post.map((comment) => ({
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
          : undefined,
        fileContent: isFileContent
          ? post.file_content.map((item) => {
              return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
            })
          : undefined,
        group: isGroup ? post.group : undefined,
        contentSummarization: isSummarize ? post.post_summarization?.content_summarization : undefined
      };
    });
    return mappedResult;
  }
}
