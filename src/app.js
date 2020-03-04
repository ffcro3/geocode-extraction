import 'dotenv/config';
import express from 'express';
import Youch from 'youch';
import mongoose from 'mongoose';
import routes from './routes';
import 'express-async-errors';
import cors from 'cors';

class App {
  constructor() {
    this.server = express();
    this.server.use(cors());
    this.middlewares();
    this.routes();
    mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        if (err) return console.log(err);

        console.log(`Connected MongoDB: ${process.env.MONGO_URL}`);
      }
    );
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({
        error: 'Internal server error',
      });
    });
  }
}

export default new App().server;
