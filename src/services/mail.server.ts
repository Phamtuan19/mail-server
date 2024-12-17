/* eslint-disable no-console */
import { SendEmailRequest } from '~/configs/interface';
import transporter from '~/configs/nodemailer.config';

/**
 *
 * @param CC (Carbon Copy): Gửi bản sao email đến các địa chỉ khác. Người nhận chính (to)
 * có thể nhìn thấy danh sách CC.
 *
 * @param BCC (Blind Carbon Copy): Gửi bản sao email nhưng danh sách người nhận BCC sẽ bị ẩn với người khác.
 *
 * @param subject Chủ đề email
 *
 */

export const sendMail = async ({ to, bcc, cc, subject, html }: SendEmailRequest) => {
   try {
      const mailOptions = {
         from: {
            address: process.env.AUTH_EMAIL!,
            name: 'Mail Server',
         },
         to,
         cc,
         bcc,
         subject,
         html,
      };

      return await transporter.sendMail(mailOptions);
   } catch (error) {
      process.env.NODE_ENV === 'production' && console.error(`Error sending email to ${to}:`, error);
   }
};
