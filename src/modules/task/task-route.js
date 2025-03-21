const express = require("express");
const router = express.Router();
const {
  createTask,
  getTaskByServiceId,
  updateTaskStatus,
  deleteTask,
  getTaskByQuery,
} = require("./task-controller");
router.post("/create-tasks", createTask);
router.get("/service/:serviceId", getTaskByServiceId);
router.get("/get-tasks-by-query", getTaskByQuery);
router.post("/update-by-Id/:id", updateTaskStatus);
router.delete("/delete/:id", deleteTask);

module.exports = router;
