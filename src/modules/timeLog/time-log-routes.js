const express = require("express");
const {
  createTimeLog,
  getTimeLogsByServiceId,
  deleteTimeLog,
  punchIn,
  punchOut,
} = require("./time-log-controller");

const router = express.Router();

// Route to create a new TimeLog
router.post("/create-log", createTimeLog);
router.post("/punch-in", punchIn);
router.post("/punch-out", punchOut);
router.get("/service/:serviceRequestId", getTimeLogsByServiceId);
router.delete("delete-log/:id", deleteTimeLog);

module.exports = router;
