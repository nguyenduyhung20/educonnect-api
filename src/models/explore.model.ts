import { redisClient } from '../config/redis-client';
import { handleSummarizeMostInteractPost } from '../controllers/summarizePost.controller';
import { logger } from '../utils/logger';
import { PostModel } from './post.model';
import { UserModel } from './user.model';

export class ExploreModel {
  static async getExplorePost() {
    try {
      const postIdList = await redisClient.sMembers('summary');
      if (postIdList.length) {
        const postIdNumberList = postIdList.map(Number);
        const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList);
        return posts.sort((a, b) => {
          const totalInteractCountA = a.interactCount + a.commentCount;
          const totalInteractCountB = b.interactCount + b.commentCount;

          return totalInteractCountB - totalInteractCountA; // Sort in descending order
        });
      } else {
        // const posts = await handleSummarizeMostInteractPost();
        const posts = await PostModel.getMostInteractPost();
        // const summarizePosts = await SummarizePostModel.getSummarizePostByListPost(posts);

        return posts.sort((a, b) => {
          const totalInteractCountA = a.interactCount + a.commentCount;
          const totalInteractCountB = b.interactCount + b.commentCount;

          return totalInteractCountB - totalInteractCountA; // Sort in descending order
        });
      }
    } catch (error) {
      logger.error('Error in handleSummarizeMostInteractPost:', error);
      throw error; // Re-throw the error to propagate it up the call stack
    }
  }

  static async getPublicExplorePost() {
    try {
      const postIdList = await redisClient.sMembers('summary');
      if (postIdList) {
        const postIdNumberList = postIdList.map(Number);
        const posts = await PostModel.getByListIdNotHaveCommentNotHaveFileContent(postIdNumberList);
        return posts.filter((item) => !item.group);
      } else {
        await handleSummarizeMostInteractPost();
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  static async getPublicMostUserFollower() {
    try {
      const results = await UserModel.getUserMostFollower();
      return results;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
