const otplib = require("otplib");
const { OtpModel } = require("./otp-modal");
const { ClientUserModal } = require("../client-user/clientUser-modal");
const { UserModal } = require("../user/user-modal");

// Send OTP to mobile number
const sendOtp = async (req, res) => {
  const { phoneNumber, is_new } = req.body;

  try {
    if (!is_new) {
      // Check if the phone number exists in the User collection
      const user = await UserModal.findOne({ mobile: phoneNumber }).populate(
        "servicePartnerId"
      );
      const clientUser = await ClientUserModal.findOne({ mobile: phoneNumber });

      if (!user && !clientUser) {
        return res
          .status(400)
          .json({ error: "Phone number is not registered with any user" });
      }

      if (user?.servicePartnerId?.status === "pending") {
        return res
          .status(400)
          .json({ error: "The company details are pending for approval" });
      }
      if (user?.servicePartnerId?.status === "rejected") {
        return res.status(400).json({
          error:
            "Your login is restricted because company details are rejected!",
        });
      }
    }

    otplib.authenticator.options = { digits: 6 };
    const otp = otplib.authenticator.generate(process.env.OTP_SECRET);
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    let otpRecord = await OtpModel.findOne({ phoneNumber });

    if (otpRecord) {
      if (new Date() > otpRecord.otpExpires) {
        await otpRecord.deleteOne();
      } else {
        return res
          .status(400)
          .json({ error: "OTP already sent to this phone number" });
      }
    }

    otpRecord = new OtpModel({
      phoneNumber,
      otp,
      otpExpires,
    });

    await otpRecord.save();

    // Send OTP in response instead
    res.json({
      message: "OTP generated successfully",
      otp, // Include the OTP in the response
      data: { phoneNumber },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
      error: error.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp, is_new } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  try {
    const otpRecord = await OtpModel.findOne({ phoneNumber });

    if (!otpRecord) {
      return res
        .status(404)
        .json({ error: "OTP record not found for this phone number" });
    }

    if (otpRecord.otp !== otp || new Date() > otpRecord.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    otpRecord.otpExpires = null;
    otpRecord.otp = null;
    await otpRecord.save();

    if (!is_new) {
      let userId = null;
      let userFrom = null;
      let userRole = null;
      const user = await UserModal.findOne({ mobile: phoneNumber }).populate(
        "role"
      );
      const clientUser = await ClientUserModal.findOne({ mobile: phoneNumber });

      if (user) {
        userId = user._id;
        userFrom = "User";
        userRole = user?.role?.name;
      } else if (clientUser) {
        userId = clientUser._id;
        userFrom = "ClientUser";
      }

      return res.status(200).json({
        message: "OTP verified successfully",
        userId,
        userFrom,
        userRole,
      });
    } else {
      return res.status(200).json({
        message: "OTP verified successfully",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
