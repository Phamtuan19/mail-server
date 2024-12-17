/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import { corsOptions } from './configs/cors';
import './database/redisdb';
import routes from './routes';

import './services/mail-queue.service';

dotenv.config();

const app = express();

const PORT = process.env.APP_PORT;

app.use(cors(corsOptions));

app.use(morgan('tiny'));

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ limit: '10mb', extended: true }));

routes.forEach((item) =>
   item.routes.forEach((route) => {
      return app.use('/api/module/mail-server' + item.prefix + route.path, route.route);
   }),
);

app.listen(PORT, () => {
   //    await connectMongoDB();
   process.env.NODE_ENV === 'production' && console.log(`[SUCCESS] ::: Server is listening on port: ${PORT}`);
});
