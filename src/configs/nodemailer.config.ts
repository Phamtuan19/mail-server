import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service: 'gmail',
   port: 465,
   pool: true,
   auth: {
      user: process.env.AUTH_EMAIL_ACCOUNT,
      pass: process.env.AUTH_EMAIL_PASSWORD,
   },
   tls: {
      rejectUnauthorized: false,
   },
});

export default transporter;
