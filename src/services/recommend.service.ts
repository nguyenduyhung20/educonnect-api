import { Message } from 'kafkajs';
import { producer } from './kafka-client';
import { KAFKA_TOPIC, RECOMMEND_SERVER } from '../constants/constants';
import { z } from 'zod';
import { logger } from '../utils/logger';
import axios from 'axios';
import { PostModel } from '../models/post.model';

export const UserEventMessageSchema = z.object({
  userId: z.string(),
  postId: z.string(),
  interactionType: z.enum(['like', 'comment', 'share', 'view']),
  timestamp: z.string().datetime(),
  metadata: z.record(z.any()).optional()
});
export type IUserEventMessage = z.infer<typeof UserEventMessageSchema>;

export const produceUserEventMessage = async (input: IUserEventMessage) => {
  try {
    const validatedInput = UserEventMessageSchema.parse(input);
    const message: Message[] = [
      {
        key: validatedInput.userId,
        value: JSON.stringify(validatedInput)
      }
    ];
    await producer(KAFKA_TOPIC.USER_EVENTS, message);
  } catch (error) {
    logger.error('Error in validating event');
  }
};

type GetRecommendPostInput = {
  userId: number;
};
type IRecommendedPost = {
  item: string;
  score: number;
};
export const getRecommendPost = async ({ userId }: GetRecommendPostInput) => {
  // Get user current topic list, for now its a dummy list
  const topicIdList = ['1', '2', '3'];
  const payload = {
    user: userId.toString(),
    topic_id: topicIdList
  };
  const response = await axios.post<IRecommendedPost[]>(`${RECOMMEND_SERVER.URL}/query`, payload);
  const postIdList = response.data.map((item) => parseInt(item.item, 10));

  const postList = await PostModel.getByListIdNotHaveComment(postIdList, userId);

  return postList;
};
