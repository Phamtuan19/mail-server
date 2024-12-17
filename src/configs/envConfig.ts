import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
   APP_PORT: process.env.APP_PORT,
   TOKEN_SECRET: process.env.TOKEN_SECRET,
   USER_BCRYPT_ROUNDS: Number(process.env.USER_BCRYPT_ROUNDS),
   USER_BCRYPT_NUMBER: process.env.USER_BCRYPT_NUMBER,
   API_VERSION: process.env.API_VERSION,

   REDIS_SECURITY_HOST: process.env.REDIS_SECURITY_HOST,
   REDIS_SECURITY_PORT: process.env.REDIS_SECURITY_PORT,
   REDIS_SECURITY_PASSWORD: process.env.REDIS_SECURITY_PASSWORD,
} as const;

export default envConfig;
