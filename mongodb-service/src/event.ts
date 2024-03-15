import { EachMessagePayload } from 'kafkajs';
import { Collection } from 'mongodb';
import { z } from 'zod';
import { logger } from './logger';

const UserPostInteractionEventSchema = z.object({
  userId: z.string(),
  postId: z.string(),
  interactionType: z.enum(['LIKE', 'COMMENT', 'SHARE', 'VIEW']),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional()
});
type UserPostInteractionEvent = z.infer<typeof UserPostInteractionEventSchema>;

export async function processEvent(collection: Collection, { message }: EachMessagePayload) {
  if (message.value === null) {
    logger.warn('Received message with null value. Skipping processing.');
    return;
  }
  try {
    const event: UserPostInteractionEvent = JSON.parse(message.value.toString());
    const validatedEvent = UserPostInteractionEventSchema.parse(event);
    await collection.insertOne(validatedEvent);
    logger.info(`Stored event: ${JSON.stringify(event)}`);
  } catch (error) {
    logger.error(`Error processing event: ${error}`);
  }
}
