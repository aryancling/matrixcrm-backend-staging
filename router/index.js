const router = require("express").Router();

const otpRoutes = require("../src/modules/otp/otp-routes");
const UserRoutes = require("../src/modules/user/user-route");
const RoleRoutes = require("../src/modules/role/role-routes");
const RcRoutes = require("../src/modules/rc/rc-routes");
const CategoryRoutes = require("../src/modules/category/category-routes");
const BankUserRoutes = require("../src/modules/bank-user/bankUser-routes");
const ItemRoutes = require("../src/modules/item/item-route");
const ServiceRequest = require("../src/modules/serviceRequests/service-request-routes");
const BankRoutes = require("../src/modules/bank/bank-routes");
const AssignServiceRoutes = require("../src/modules/assign-serivce/assign-service-route");
const QuotationsRoutes = require("../src/modules/quotation/quotation-route");
const DiscussionBoardRoutes = require("../src/modules/discussion-board/discussion-board-routes");
const PaymentsRoutes = require("../src/modules/payments/payment-route");
const TimeLogRoutes = require("../src/modules/timeLog/time-log-routes");
const PermissionsRoutes = require("../src/modules/permissions/permissions-route");
const moduleRoutes = [
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/payments",
    route: PaymentsRoutes,
  },
  {
    path: "/permissions",
    route: PermissionsRoutes,
  },
  {
    path: "/time-log",
    route: TimeLogRoutes,
  },
  {
    path: "/quotations",
    route: QuotationsRoutes,
  },
  {
    path: "/assign-service",
    route: AssignServiceRoutes,
  },
  {
    path: "/item",
    route: ItemRoutes,
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
  {
    path: "/serviceRequest",
    route: ServiceRequest,
  },
  {
    path: "/Bank",
    route: BankRoutes,
  },
  {
    path: "/discussion-board",
    route: DiscussionBoardRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
