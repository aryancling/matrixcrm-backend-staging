const router = require('express').Router();

const otpRoutes = require('../src/modules/otp/otp-routes');
const UserRoutes = require('../src/modules/user/user-route')

const moduleRoutes = [
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
