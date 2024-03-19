import { redisClient } from '../config/redis-client';
import { handleSummarizeMostInteractPost } from '../controllers/summarizePost.controller';
import { PostModel } from './post.model';

export class ExploreModel {
  static async getExplorePost(userIdRequesting: number) {
    const postIdList = await redisClient.sMembers('summary');
    if (postIdList) {
      const postIdNumberList = postIdList.map(Number);
      const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList, userIdRequesting);
      return posts;
    } else {
      await handleSummarizeMostInteractPost();
    }
  }
}
