import 'dotenv/config';
import app from './app';
import { PORT } from './config/index.config';
import { logger } from './utils/logger';
import { redisClient } from './config/redis-client';
import cron from 'node-cron';
import { handleSummarizeMostInteractPost } from './controllers/summarizePost.controller';

app.listen(PORT, () => logger.info(`running server on http://localhost:${PORT}`));

redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

cron.schedule('* * * * *', async () => {
  logger.info('Running your cron job');
  const posts = await handleSummarizeMostInteractPost();
  redisClient.select(1); // database 1 stores data summarized
  posts.summaries.forEach(async (summary) => {
    const key = `summary:${summary.id}`;
    await redisClient.hSet(key, {
      groupId: summary.groupId || -1,
      title: summary.title,
      user: JSON.stringify({ id: summary.user.id, name: summary.user.name || '', avatar: summary.user.avatar || '' }),
      content: summary.content || '',
      commentCount: summary.commentCount,
      interactCount: summary.interactCount,
      createdAt: summary.createdAt
    });
  });
});
