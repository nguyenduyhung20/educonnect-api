import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import router from './routes/index.route';
import { handleError } from './middleware/error.middleware';

// express app
const app = express();

// cors
app.use(cors());

// file upload
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } })); // 50 MB

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

// custom middleware should go here
app.get('/', async (req, res) => {
  res.send('BKU with love <3');
});

// routes
app.use('/api', router);

app.use(handleError);

export default app;
