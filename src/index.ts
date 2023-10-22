import 'dotenv/config';
import app from './app';
import { PORT } from './config/index.config';

app.listen(PORT, () => console.log(`running server on http://localhost:${PORT}`));
