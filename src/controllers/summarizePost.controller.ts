import { SummarizePostsApi } from '../models/summarizePost.model';
import { PostModel } from '../models/post.model';

interface Post {
  groupId: number | undefined;
  id: number;
  user: {
    id: number;
    name: string | null;
    avatar: string | null;
  };
  title: string;
  content: string | null;
  commentCount: number;
  interactCount: number;
  createdAt: string;
}

export const handleSummarizeMostInteractPost = async (): Promise<{ summaries: Post[] }> => {
  try {
    const posts = await PostModel.getMostInteractPost();
    const results = await SummarizePostsApi.postSummarizePost(posts);
    return results;
  } catch (error: any) {
    return error;
  }
};
