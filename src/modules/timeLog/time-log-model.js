const mongoose = require("mongoose");


const TimeLogSchema = new mongoose.Schema(
  {
    serviceRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    user_Id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    punchOutTime: {
      type: String,
      required: true,
     
    },
    punchInTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TimeLog = mongoose.model("TimeLog", TimeLogSchema);

module.exports = {TimeLog };
