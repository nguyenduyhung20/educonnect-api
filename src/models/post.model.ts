import { Prisma, post } from '@prisma/client';
import prisma from '../databases/client';
import { db } from '../databases/kysely';
import { sql } from 'kysely';

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

export class PostModel {
  static async getAll(limit = 20) {
    return prisma.post.findMany({
      take: limit,
      where: {
        parent_post_id: null,
        deleted: false
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
      include: {
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          include: {
            ...InteractCountInclude
          },
          orderBy: {
            create_at: 'asc'
          }
        },
        ...InteractCountInclude
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
      include: {
        other_post: {
          take: commentLimit,
          where: {
            deleted: false
          },
          include: {
            ...InteractCountInclude
          },
          orderBy: {
            create_at: 'asc'
          }
        },
        ...InteractCountInclude
      }
    });
  }

  static async getUserPost(id: number) {
    const result = prisma.user.findMany({
      where: {
        id: id
      },
      include: {
        post: {
          where: {
            parent_post_id: null,
            deleted: false
          },
          include: {
            other_post: {
              where: {
                deleted: false
              }
            },
            ...InteractCountInclude
          }
        }
      }
    });

    return result;
  }

  static async getUserPostRaw(id: number) {
    const postWithCommentsRecord = await db
      .selectFrom('post')
      .leftJoinLateral(
        (eb) =>
          eb
            .selectFrom('post as comment')
            .selectAll()
            .whereRef('comment.parent_post_id', '=', 'post.id')
            .orderBy('comment.create_at desc')
            .limit(1)
            .as('comment'),
        (join) => join.onRef('comment.parent_post_id', '=', 'post.id')
      )
      .leftJoinLateral(
        (eb) =>
          eb
            .selectFrom('interact')
            .select((eb) => ['post_id', eb.fn.countAll().as('interaction_count')])
            .where((eb) => eb.and([eb('post_id', '=', eb.ref('post.id')), eb('deleted', '=', false)]))
            .groupBy('post_id')
            .as('interactions'),
        (join) => join.onRef('interactions.post_id', '=', 'post.id')
      )
      .where(({ eb }) =>
        eb.and([eb('post.user_id', '=', id), eb('post.parent_post_id', 'is', null), eb('post.deleted', '=', false)])
      )
      .orderBy('post.create_at desc')
      .select((eb) => [
        'post.id as post_id',
        'post.content as post_content',
        'post.create_at as post_create_at',
        'post.update_at as post_update_at',
        'post.deleted as post_deleted',
        'post.post_uuid as post_post_uuid',
        'post.user_id as post_user_id',
        'post.parent_post_id as post_parent_post_id',
        'comment.id as comment_id',
        'comment.content as comment_content',
        'comment.create_at as comment_create_at',
        'comment.update_at as comment_update_at',
        'comment.deleted as comment_deleted',
        'comment.post_uuid as comment_post_uuid',
        'comment.user_id as comment_user_id',
        'comment.parent_post_id as comment_parent_post_id',
        eb.fn.coalesce('interaction_count', sql<number>`0`).as('interaction_count')
      ])
      .execute();

    if (!postWithCommentsRecord.length) {
      return null;
    }

    console.log(postWithCommentsRecord);

    const result = postWithCommentsRecord.map((record) => {
      const {
        post_id,
        post_content,
        post_create_at,
        post_update_at,
        post_deleted,
        post_post_uuid,
        post_user_id,
        post_parent_post_id
      } = record;

      const post: post = {
        id: post_id,
        content: post_content,
        create_at: post_create_at,
        update_at: post_update_at,
        deleted: post_deleted,
        post_uuid: post_post_uuid,
        user_id: post_user_id,
        parent_post_id: post_parent_post_id
      };

      const comments: post = {
        id: record.comment_id as number,
        content: record.comment_content,
        create_at: record.comment_create_at as Date,
        update_at: record.comment_update_at as Date,
        deleted: record.comment_deleted as boolean,
        post_uuid: record.comment_post_uuid as string,
        user_id: record.comment_user_id as number,
        parent_post_id: record.comment_parent_post_id
      };

      return { post, comments };
    });

    return result;
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
