import { redisClient } from '../config/redis-client';
import { handleSummarizeMostInteractPost } from '../controllers/summarizePost.controller';
import { PostModel } from './post.model';
import { UserModel } from './user.model';

export class ExploreModel {
  static async getExplorePost() {
    const postIdList = await redisClient.sMembers('summary');
    if (postIdList) {
      const postIdNumberList = postIdList.map(Number);
      const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList);
      return posts;
    } else {
      await handleSummarizeMostInteractPost();
    }
  }

  static async getPublicExplorePost() {
    const postIdList = await redisClient.sMembers('summary');
    if (postIdList) {
      const postIdNumberList = postIdList.map(Number);
      const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList);
      return posts.filter((item) => !item.groupId);
    } else {
      await handleSummarizeMostInteractPost();
    }
  }

  static async getPublicMostUserFollower() {
    const results = await UserModel.getUserMostFollower();
    return results;
  }
}
