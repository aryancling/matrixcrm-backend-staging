const router = require('express').Router();

const otpRoutes = require('../src/modules/otp/otpRoutes');


const moduleRoutes = [
  {
    path: '/otp',
    route: otpRoutes,
  },
  
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
