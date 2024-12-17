import { Router } from 'express';

import { HttpStatusCodeType } from './httpStatus';

export interface ResponseSuccess<T = object> {
   status: HttpStatusCodeType;
   success: boolean;
   message: string;
   data: T | null;
}

export interface ResponsePaginationSuccess<T = object> {
   status: HttpStatusCodeType;
   success: boolean;
   message: string;
   data: {
      data: T[] | null;
      currentPage: number;
      totalPage: number;
      limit: number;
      nextPage: boolean;
      previousPage: boolean;
   };
}

export interface DataError {
   type: 'validate';
}

export interface Routes {
   path: string;
   route: Router;
}

export interface RouterGroup {
   prefix: string;
   routes: Routes[];
}

/**
 *
 * @param CC (Carbon Copy): Gửi bản sao email đến các địa chỉ khác. Người nhận chính (to)
 * có thể nhìn thấy danh sách CC.
 *
 * @param BCC (Blind Carbon Copy): Gửi bản sao email nhưng danh sách người nhận BCC sẽ bị ẩn với người khác.
 *
 * @param subject Chủ đề email
 *
 * @param to người nhận
 *
 * @param html Nội dung email
 *
 */
export interface SendEmailRequest {
   to: string;
   cc?: string;
   bcc?: string;
   subject: string;
   html: string;
}
