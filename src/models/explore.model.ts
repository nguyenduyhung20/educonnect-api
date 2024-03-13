import prisma from '../databases/client';
import { redisClient } from '../config/redis-client';
import { handleSummarizeMostInteractPost } from '../controllers/summarizePost.controller';

export class ExploreModel {
  static async getExplorePost(postLimit = 100) {
    const postIdList = await redisClient.sMembers('summary');
    if (postIdList) {
      console.log('this is ', postIdList);
      const postIdNumberList = postIdList.map(Number);

      const posts = await prisma.post.findMany({
        take: postLimit,
        where: {
          deleted: false,
          id: {
            in: postIdNumberList
          }
        },
        select: {
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
      return posts;
    } else {
      await handleSummarizeMostInteractPost();
    }
  }
}
