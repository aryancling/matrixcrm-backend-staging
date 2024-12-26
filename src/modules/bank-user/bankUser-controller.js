const { BankUserModal } = require("./bankUser-modal");
const mongoose = require("mongoose"); // Import mongoose for ObjectId validation

// Create a new user
const createBankUser = async (req, res) => {
  try {
    const { name, mobile, user_type, reporting_to, bankId ,profileImage } = req.body;

    // Validate ObjectId for bankId
    if (bankId && !mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({ message: "Invalid bankId" });
    }

    // Validate ObjectId for reporting_to only if it's provided
    if (reporting_to && reporting_to !== "" && !mongoose.Types.ObjectId.isValid(reporting_to)) {
      return res.status(400).json({ message: "Invalid reporting_to ID" });
    }

    const newUser = new BankUserModal({
      name,
      mobile,
      user_type,
      reporting_to: reporting_to || undefined, // Set to undefined if empty
      bankId,
      profileImage
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Get all users
const getAllBankUsers = async (req, res) => {
  try {
    const users = await BankUserModal.find();
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get a single user by ID
const getBankUserById = async (req, res) => {
  try {
    const user = await BankUserModal.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Update user details
const updateBankUser = async (req, res) => {
  try {
    const { reporting_to, bankId } = req.body;

    // Validate ObjectId for reporting_to only if it's provided
    if (reporting_to && reporting_to !== "" && !mongoose.Types.ObjectId.isValid(reporting_to)) {
      return res.status(400).json({ message: "Invalid reporting_to ID" });
    }
    if (bankId && !mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({ message: "Invalid bankId" });
    }

    const updatedUser = await BankUserModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, reporting_to: reporting_to || undefined }, // Set to undefined if empty
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete a user
const deleteBankUser = async (req, res) => {
  try {
    const deletedUser = await BankUserModal.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  createBankUser,
  getAllBankUsers,
  getBankUserById,
  updateBankUser,
  deleteBankUser,
};
