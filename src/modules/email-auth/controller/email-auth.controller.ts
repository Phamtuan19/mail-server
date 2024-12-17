import { Request, Response } from 'express';

import { MailAuthVerifyAccountSchema } from './email-auth.interface';

import HTTPSTATUSCODES from '~/configs/httpStatus';
import { responseError, responseSuccess } from '~/configs/response';
import { emailQueue } from '~/services/queue';

const sendMailController = async (req: Request<unknown, unknown, MailAuthVerifyAccountSchema>, res: Response) => {
   try {
      const { _id, type } = req.body;

      await emailQueue.add(
         { _id, type },
         {
            attempts: 3, // Số lần retry
            backoff: 5000, // Thời gian đợi giữa các lần retry
            removeOnComplete: true, // Xóa job sau khi hoàn thành
            removeOnFail: true, // Xóa job sau khi thất bại đủ số lần retry
         },
      );

      const dataResponse = {
         data: null,
         message: 'Gửi mail thành công',
         status: HTTPSTATUSCODES.SUCCESS,
         success: true,
      };

      return responseSuccess(res, dataResponse);
   } catch (error) {
      const dataResponseError = {
         success: false,
         message: 'Đã có lỗi xảy ra.',
         status: HTTPSTATUSCODES.BAD_REQUEST,
         data: error,
      };
      return responseError(res, dataResponseError, HTTPSTATUSCODES.BAD_REQUEST);
   }
};

export { sendMailController };
