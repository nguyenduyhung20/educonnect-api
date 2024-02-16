import 'dotenv/config';
import app from './app';
import { PORT } from './config/index.config';
import { logger } from './utils/logger';
import { redisClient } from './config/redis-client';

app.listen(PORT, () => logger.info(`running server on http://localhost:${PORT}`));

redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();
