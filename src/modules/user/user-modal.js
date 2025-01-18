const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: function () {
        return this.userType === "clientUser";
      },
    },
    profileImage: {
      type: String,
      required: function () {
        return this.userType === "clientUser";
      },
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "clientUser"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model("User", UserSchema);
module.exports = { UserModal };
