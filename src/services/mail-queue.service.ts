/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import fs from 'fs';

import Handlebars from 'handlebars';

import { sendMail } from './mail.server';

import { emailQueue, TypeMail } from '~/services/queue';
import redisClient from '~/database/redisdb';
import { SendEmailRequest } from '~/configs/interface';

// Xác định đường dẫn template email
const templatePath = path.resolve(__dirname, '../../src/template/verifyAccount.html');

// Kiểm tra sự tồn tại của tệp trước khi đọc
if (!fs.existsSync(templatePath)) {
   console.error(`Template file not found: ${templatePath}`);
   process.exit(1); // Kết thúc chương trình nếu tệp không tồn tại
}

const REDIS_AUTH = {
   USER_VERIFIED_CODE: 'auth:user_verified_code:',
   VERIFIED_CODE_RESET_PASSWORD: 'auth:reset_password:',
};

interface UserVerifyCodeMailType {
   code: string;
   email: string;
   fullName: string;
   ex: number;
}

// Đọc nội dung và biên dịch template
const templateSource = fs.readFileSync(templatePath, 'utf8');
const emailTemplate = Handlebars.compile(templateSource);

const dataSendMail = async (type: TypeMail, _id: string) => {
   if (type === 'reset_password') {
      return await redisClient.get(`${REDIS_AUTH.VERIFIED_CODE_RESET_PASSWORD}${_id}`);
   }

   return await redisClient.get(`${REDIS_AUTH.USER_VERIFIED_CODE}${_id}`);
};

// Xử lý email trong hàng đợi
emailQueue.process(async (job, done) => {
   try {
      const { _id, type } = job.data;

      // Lấy mã xác thực người dùng từ Redis
      const userVerifyCodeMail = await dataSendMail(type, _id);

      console.log('🚀 ~ emailQueue.process ~ userVerifyCodeMail:', userVerifyCodeMail);
      if (!userVerifyCodeMail) {
         console.warn(`[Email Queue]: Không tìm thấy mã xác thực cho user ID: ${_id}`);
         done();
         return;
      }

      const { email, fullName, code, ex } = JSON.parse(userVerifyCodeMail) as UserVerifyCodeMailType;

      // Thực hiện gửi email hoặc xử lý thêm nếu cần
      let emailContent;
      let subject;

      switch (type) {
         case 'verify_account':
            subject = 'Xác thực tài khoản.';
            emailContent = emailTemplate({
               USER_NAME: fullName,
               VERIFICATION_CODE: code,
               EX: Math.floor(Number(ex) / 60),
            });
            break;
         case 'reset_password':
            subject = 'Quên mật khẩu.';
            emailContent = emailTemplate({
               USER_NAME: fullName,
               VERIFICATION_CODE: code,
               EX: Math.floor(Number(ex) / 60),
            });
            break;
         default:
            subject = 'Xác thực tài khoản.';
            emailContent = emailTemplate({
               USER_NAME: fullName,
               VERIFICATION_CODE: code,
               EX: Math.floor(Number(ex) / 60),
            });
      }

      console.log(`[Email Queue]: Nội dung email cho user ID ${_id} đã được tạo.`);

      const mailOptions: SendEmailRequest = {
         to: email,
         subject,
         html: emailContent,
      };

      await sendMail(mailOptions);

      // Kết thúc công việc
      done();
   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error(`[Email Queue]: Lỗi khi xử lý công việc: ${error.message}`);
         done(error); // Đảm bảo done chỉ nhận kiểu Error
      } else {
         console.error(`[Email Queue]: Lỗi không xác định:`, error);
         done(new Error('Unknown error occurred'));
      }
   }
});

// Xử lý lỗi từ hàng đợi
emailQueue.on('failed', (job, err) => {
   console.error(`[Email Queue]: Job ID: ${job.id} thất bại. Lỗi: ${err?.message}`);
});

export default emailQueue;
