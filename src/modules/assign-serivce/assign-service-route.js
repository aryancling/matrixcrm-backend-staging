const express = require("express");
const router = express.Router();
const AssignServiceController = require("./assign-service-controller");

router.post("/createAssignment", AssignServiceController.createAssignment);

router.get("/assignments", AssignServiceController.getAllAssignments);

router.get(
  "/assignments/service/:serviceId",
  AssignServiceController.getAssignmentsByServiceId
);

router.put(
  "/assignments/:assignmentId",
  AssignServiceController.updateAssignmentById
);

router.delete(
  "/assignments/:assignmentId",
  AssignServiceController.deleteAssignmentById
);

module.exports = router;
