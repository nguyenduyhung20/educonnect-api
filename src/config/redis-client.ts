import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const initializeRedisClient = async () => {
  try {
    redisClient.on('error', (err: Error) => {
      logger.error('Redis Client Error', err);
    });

    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
  }
};
