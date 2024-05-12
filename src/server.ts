import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import './discord';

const app = express();
const port = process.env.PORT || 3001;

if (typeof process.env.SESSION_KEY === 'undefined') {
  throw new Error('SESSION_KEY is not defined in the environment variables');
}

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.set('trust proxy', true);
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
