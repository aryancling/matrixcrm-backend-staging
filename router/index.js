const router = require("express").Router();

const otpRoutes = require("../src/modules/otp/otp-routes");
const UserRoutes = require("../src/modules/user/user-route");
const RoleRoutes = require("../src/modules/role/role-routes");
const RcRoutes = require("../src/modules/rc/rc-routes");
const CategoryRoutes = require("../src/modules/category/category-routes");
const BankUserRoutes = require("../src/modules/bank-user/bankUser-routes");

const moduleRoutes = [
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/Bankuser",
    route: BankUserRoutes,
  },
  {
    path: "/role",
    route: RoleRoutes,
  },
  {
    path: "/rc",
    route: RcRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
