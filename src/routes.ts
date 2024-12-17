import mailAuthRouter from './modules/email-auth/mail-auth.route';

const routes = [
   {
      prefix: '',
      routes: [
         {
            path: '',
            route: mailAuthRouter,
         },
      ],
   },
];

export default routes;
