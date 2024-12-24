const otplib = require("otplib");
const twilio = require("twilio");
const { OtpModel } = require("./otp-modal");
const {BankUserModal} = require('../bank-user/bankUser-modal')
const {UserModal} = require('../user/user-modal')
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const senderPhone = process.env.TWILIO_PHONE_NUMBER;

// Send OTP to mobile number
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if the phone number exists in the User collection
    const user = await UserModal.findOne({ mobile: phoneNumber });
    const bankUser = await BankUserModal.findOne({ mobile: phoneNumber });

    if (!user && !bankUser) {
      return res
        .status(400)
        .json({ error: "Phone number is not registered with any user" });
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
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

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


    const user = await UserModal.findOne({ mobile: phoneNumber });
    const bankUser = await BankUserModal.findOne({ mobile: phoneNumber });
    const userId = user ? user._id : bankUser ? bankUser._id : null;

    return res.status(200).json({ 
      message: "OTP verified successfully", 
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
