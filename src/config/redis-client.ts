import { createClient } from 'redis';
import { logger } from '../utils/logger';
import { REDIS } from '../constants/constants';

export const redisClient = createClient({
  url: REDIS.URI
});

export const initializeRedisClient = async () => {
  logger.info(`Connecting to Redis with url ${REDIS.URI.slice(0, 15)}...`);
  await redisClient.on('error', (err) => logger.error('Redis Client Error: ', err)).connect();
};
