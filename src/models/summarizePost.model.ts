import { apiPost } from '../utils/apiRequest';

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

export class SummarizePostsApi {
  static async postSummarizePost(posts: Post[]): Promise<{ summaries: Post[] }> {
    return await apiPost('/summarize', posts);
  }
}
