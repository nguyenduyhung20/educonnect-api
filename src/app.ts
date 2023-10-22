import express from 'express';
import cors from 'cors';
import router from './routes/index.route';

// express app
const app = express();

// json response formatting
app.set('json spaces', 2);

// cors
app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middleware should go here

// routes
app.use(router);

export default app;
