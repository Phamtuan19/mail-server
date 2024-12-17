import express from 'express';

import { mailAuthVerifyAccountSchema, sendMailController } from './controller';

import envConfig from '~/configs/envConfig';
import validateResource from '~/helpers/validate-resource';

const mailAuthRouter = express.Router();

mailAuthRouter.post(
   `/send-mail/verify-account/${envConfig.API_VERSION}`,
   validateResource(mailAuthVerifyAccountSchema),
   sendMailController,
);

export default mailAuthRouter;
