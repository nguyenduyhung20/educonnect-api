import 'dotenv/config';
import app from './app';
import { PORT } from './config/index.config';
import { logger } from './utils/logger';
import { initializeRedisClient } from './config/redis-client';
// import cron from 'node-cron';
// import { handleSummarizeMostInteractPost } from './controllers/summarizePost.controller';

const startServer = () => {
  app.listen(PORT, () => logger.info(`Running server on port ${PORT}`));
};
// const scheduleCronJob = () => {
//   cron.schedule('* * * * *', async () => {
//     logger.info('Running your cron job');
//     try {
//       await handleSummarizeMostInteractPost();
//     } catch (error: any) {
//       logger.warn(`Cronjob failed with: ${error.message}\n`, error);
//     }
//   });
// };
const main = async () => {
  await initializeRedisClient();
  startServer();
  // scheduleCronJob();
};

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
