/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { createClient } from 'redis';
import dotenv from 'dotenv';

import envConfig from '~/configs/envConfig';

dotenv.config();

const redisClient = createClient({
   socket: {
      host: envConfig.REDIS_SECURITY_HOST,
      port: Number(envConfig.REDIS_SECURITY_PORT),
   },
   password: envConfig.REDIS_SECURITY_PASSWORD,
});

redisClient
   .connect()
   .then(() => {
      console.log('[SUCCESS] ::: Connected to Redis');
   })
   .catch((error) => {
      console.log('[ERROR] ::: ', error.message);
   });

redisClient.on('error', (error) => {
   console.log(error.message);
});

export default redisClient;
