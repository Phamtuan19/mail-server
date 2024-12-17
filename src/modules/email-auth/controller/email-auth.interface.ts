import { z } from 'zod';

export const mailAuthVerifyAccountSchema = z.object({
   body: z.object({
      _id: z.string({
         required_error: 'Mã người dùng không được để trống',
      }),
      type: z.enum(['verify_account', 'reset_password'], {
         required_error: 'Loại mail không được để trống',
      }),
   }),
});

export type MailAuthVerifyAccountSchema = z.TypeOf<typeof mailAuthVerifyAccountSchema>['body'];

export interface SendMailAuthData {
   reidsVerifiedUserCode: number;
   email: string;
   fullName: string;
}
