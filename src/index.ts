import 'dotenv/config';
import app from './app';
import { PORT } from './config/index.config';
import { logger } from './utils/logger';

app.listen(PORT, () => logger.info(`running server on http://localhost:${PORT}`));
