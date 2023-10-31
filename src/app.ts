import express from 'express';
import cors from 'cors';
import router from './routes/index.route';
import { handleError } from './middleware/error.middleware';

// express app
const app = express();

// cors
app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middleware should go here

// routes
app.use(router);

app.use(handleError);

export default app;
