import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import router from './routes/index.route';
import { handleError } from './middleware/error.middleware';
import { AppError } from './config/AppError';
import { morganMiddleware } from './middleware/morgan.middleware';
import compression from 'compression';

// express app
const app = express();

// cors
app.use(cors());

// compression
app.use(
  compression({
    level: 6
  })
);

// file upload
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } })); // 50 MB

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

app.use(morganMiddleware);

// custom middleware should go here
app.get('/', async (req, res) => {
  res.send('BKU with love <3');
});
app.get('/error', async (req, res, next) => {
  try {
    throw new AppError(400, 'BAD_REQUEST');
  } catch (error) {
    next(error);
  }
});

app.use('/public', express.static('public'));

// routes
app.use('/api', router);

app.use(handleError);

export default app;
