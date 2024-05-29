import { Message } from 'kafkajs';
import { producer } from '../config/kafka-client';
import { KAFKA_TOPIC, MONGODB, RECOMMEND_SERVER } from '../constants/constants';
import { z } from 'zod';
import { logger } from '../utils/logger';
import axios from 'axios';
import { PostService } from './post.service';
import { mongo } from '../databases/mongo';

export const UserEventMessageSchema = z.object({
  userId: z.number(),
  postId: z.number(),
  postTopic: z.array(z.number()),
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
        key: validatedInput.userId.toString(),
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
export const getRecommendPosts = async ({ userId }: GetRecommendPostInput) => {
  // Get user current topic list, for now its a dummy list
  const userEvents = mongo.db(MONGODB.DB_NAME).collection(MONGODB.COLLECTION.USER_EVENTS);
  const query = {
    userId: userId.toString()
  };
  const findResult = await userEvents.find(query).toArray();

  if (findResult.length === 0) {
    console.log('No documents found!');
  } else {
    console.log('Documents found:', findResult);
  }

  // Find top 3 topic id, will find a better way in future, for now just working
  const allTopicId: number[] = findResult
    .filter((item) => !isNaN(Number(item.postId)))
    .map((item) => parseInt(item.postId, 10));

  const countMap: Record<number, number> = {};
  allTopicId.forEach((num) => {
    countMap[num] = (countMap[num] || 0) + 1;
  });
  const counts = Object.values(countMap);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  // Normalized count from 0 to 1 to adjust the bias rate in the future
  const normalizedCountMap: Record<number, number> = {};
  Object.entries(countMap).forEach(([num, count]) => {
    const normalizedCount = (count - minCount) / (maxCount - minCount);
    normalizedCountMap[Number(num)] = normalizedCount;
  });
  const countPairs = Object.entries(normalizedCountMap).map(([num, count]) => [Number(num), count]);
  countPairs.sort((a, b) => b[1] - a[1]);

  // Get top 3 for now, in the future will bias all the topics
  const topicIdList = countPairs.slice(0, 3).map((pair) => pair[0]);

  const payload = {
    user: userId,
    topic_id: topicIdList
  };
  let postIdList: number[] = [];
  try {
    const response = await axios.post<{ result: IRecommendedPost[] }>(
      `http://${RECOMMEND_SERVER.URL}/queries`,
      payload
    );
    postIdList = response.data.result.map((item) => parseInt(item.item, 10));
  } catch (error) {
    logger.error('Cannot connect to recommend service');
  }

  const postList = await PostService.getPostsList({
    postIdList,
    userIdRequesting: userId,
    isComment: false,
    isSummarize: false
  });

  return postList;
};
