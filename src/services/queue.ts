import Bull from 'bull';

import envConfig from '~/configs/envConfig';

export type TypeMail = 'verify_account' | 'reset_password';

const emailQueue = new Bull<{ _id: string; type: TypeMail }>('emailQueue', {
   redis: {
      host: envConfig.REDIS_SECURITY_HOST,
      port: Number(envConfig.REDIS_SECURITY_PORT),
      password: envConfig.REDIS_SECURITY_PASSWORD,
   },
});

export { emailQueue };
