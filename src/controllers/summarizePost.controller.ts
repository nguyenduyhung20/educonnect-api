import { PostModel } from '../models/post.model';
import { SummarizePostModel } from '../models/summarizePost.model';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis-client';

export const handleSummarizeMostInteractPost = async () => {
  const posts = await PostModel.getMostInteractPost();
  const results = await SummarizePostModel.postSummarizePost(
    posts
      .filter((item) => typeof item.contentSummarization === 'undefined')
      .map((item) => {
        return { id: item.id, content_summarization: item.content };
      })
  );
  await handleStoreSummarizeContentPost(results.summaries); // Store the summarized posts in the database only if they haven't been summarized before.

  // Push id of post summarized
  posts.forEach((item) => {
    const findItem = results.summaries.find((subItem) => subItem.id === item.id);
    if (!findItem) {
      results.summaries.push({ id: item.id, content_summarization: item.contentSummarization });
    } else {
      item.contentSummarization = findItem.content_summarization ?? undefined;
    }
  });

  for (const summary of results.summaries) {
    const key = `summary`;
    await redisClient.SADD(key, `${summary.id}`);
  }

  return posts;
};

export const handleStoreSummarizeContentPost = async (summaries: Prisma.post_summarizationCreateManyInput[]) => {
  try {
    await SummarizePostModel.createSummarizeContentPost(summaries);
  } catch (error: any) {
    logger.error(error);
    return error;
  }
};
