import { redisClient } from '../config/redis-client';
import { handleSummarizeMostInteractPost } from '../controllers/summarizePost.controller';
import { PostModel } from './post.model';

export class ExploreModel {
  static async getExplorePost(postLimit = 100) {
    const postIdList = await redisClient.sMembers('summary');
    if (postIdList) {
      const postIdNumberList = postIdList.map(Number);

      const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList, postLimit);
      return posts;
    } else {
      await handleSummarizeMostInteractPost();
    }
  }
}
