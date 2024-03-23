import { Message } from 'kafkajs';
import { producer } from './kafka-client';
import { KAFKA_CLIENT_ID, KAFKA_TOPIC } from '../constants/constants';
import { z } from 'zod';
import { logger } from '../utils/logger';

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
    await producer(KAFKA_TOPIC.USER_EVENTS, message, KAFKA_CLIENT_ID.USER_EVENTS_1);
  } catch (error) {
    logger.error('Error in validating event');
  }
};
