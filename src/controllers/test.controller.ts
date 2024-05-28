import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../config/AppError';
import prisma from '../databases/client';

export const handleTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const postIdList = [1, 2, 3];
    // const users = await db.selectFrom('user').select('name').execute();
    const rows = await prisma.post.findMany({
      where: {
        id: 1,
        deleted: false
      },
      include: {
        post_summarization: {
          select: {
            content_summarization: true
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

    const row = rows[0];

    const messages = [
      {
        key: 'post',
        value: JSON.stringify({
          id: row.id,
          title: row.title,
          content: row.content,
          content_summarization: row.post_summarization?.content_summarization || null,
          file_content: row.file_content,
          post_uuid: row.post_uuid,
          user_id: row.user_id,
          parent_post_id: row.parent_post_id,
          group_id: row.group_id,
          view: 0,
          interact_count: row._count.interact,
          comment_count: row._count.other_post,
          create_at: row.create_at,
          update_at: row.update_at,
          deleted: row.deleted
        })
      }
    ];
    return res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
};

export const handleError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new CustomError(418, 'Hello teapot');
  } catch (error) {
    next(error);
  }
};
