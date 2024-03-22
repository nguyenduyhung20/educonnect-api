import { apiPost } from '../utils/apiRequest';
import prisma from '../databases/client';
import { Prisma } from '@prisma/client';

export class SummarizePostModel {
  static async postSummarizePost(
    posts: Prisma.post_summarizationCreateManyInput[]
  ): Promise<{ summaries: Prisma.post_summarizationCreateManyInput[] }> {
    try {
      return await apiPost('/summarize', posts);
    } catch (error) {
      // Handle the error here
      throw new Error(`Failed to summarize posts ${error}`);
    }
  }

  static async createSummarizeContentPost(summaries: Prisma.post_summarizationCreateManyInput[]) {
    return await prisma.post_summarization.createMany({
      data: summaries,
      skipDuplicates: true
    });
  }
}
