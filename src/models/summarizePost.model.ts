import { apiPost } from '../utils/apiRequest';
import prisma from '../databases/client';
import { Prisma } from '@prisma/client';

export class SummarizePostModel {
  static async postSummarizePost(
    posts: Prisma.post_summarizationCreateManyInput[]
  ): Promise<{ summaries: Prisma.post_summarizationCreateManyInput[] }> {
    try {
      return await apiPost('/summarize', posts);
    } catch (error: any) {
      // Handle the error here
      throw new Error(`Failed to summarize posts by ${error.message}`);
    }
  }

  static async createSummarizeContentPost(summaries: Prisma.post_summarizationCreateManyInput[]) {
    return await prisma.post_summarization.createMany({
      data: summaries,
      skipDuplicates: true
    });
  }

  static async getSummarizePostByListPost(
    listPost: {
      user: {
        id: number;
        name: string | null;
        avatar: string | null;
      };
      title: string;
      id: number;
    }[]
  ) {
    return prisma.post_summarization.findMany({
      select: {
        id: true,
        content_summarization: true
      },
      where: {
        id: {
          in: listPost.map((item) => item.id)
        }
      }
    });
  }
}
