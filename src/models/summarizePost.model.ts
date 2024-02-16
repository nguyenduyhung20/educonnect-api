import { apiPost } from '../utils/apiRequest';

export class SummarizePostsApi {
  static async postSummarizePost(data: { text: string }): Promise<string> {
    return await apiPost('/summarize', data);
  }
}
