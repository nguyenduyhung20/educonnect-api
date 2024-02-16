import { PostModel } from '../models/post.model';

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
      user: post.user,
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
          user: subComment.user,
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
  }

  static async getUserPosts({
    userId,
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
          user: post.user,
          title: post.title,
          content: post.content,
          parentPostId: post.post?.id ?? undefined,
          commentCount: post._count.other_post,
          interactCount: post._count.interact,
          userInteract: post.interact[0]?.type ?? null,
          createdAt: post.create_at,
          fileContent: post.file_content.map((item) => {
            return item.startsWith('http') ? item : process.env.NEXT_PUBLIC_API_HOST + item;
          })
        };
        return mappedPost;
      });

      return mappedResult;
    } else {
      const result = await PostModel.getPostWithCommentByUserId(userId, userIdRequesting);
      const mappedResult = result.post.map((post) => {
        const mappedPost = {
          id: post.id,
          user: post.user,
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
              user: subComment.user,
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
        user: post.user,
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
            user: subComment.user,
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
