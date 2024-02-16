import { SummarizePostsApi } from '../models/summarizePost.model';

export const handleSummarizePost = async (data: { text: string }) => {
  try {
    const result = await SummarizePostsApi.postSummarizePost(data);
    return result;
  } catch (error) {
    // next(error);
    return error;
  }
};
