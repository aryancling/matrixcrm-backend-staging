const { UserModal } = require("./user-modal");

const { BankUserModal } = require("../bank-user/bankUser-modal");

const getUserAndBankUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModal.findById(id).populate({
      path: 'role',
      select: 'name permissions' 
    }).lean();   
     if (user) {
      return res.status(200).json({
        user: user ,
        userFrom: "User",
      });
    } else {
      const BankUser = await BankUserModal.findById(id).populate('bankId');
      if (!BankUser) {
        return res.status(500).json({ message: "No User Available", error });
      }
      return res.status(200).json({
        user: BankUser,
        userFrom: "BankUser",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, mobile, role } = req.body;
    const newUser = new UserModal({ name, mobile, role });
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
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModal.find().populate('role', 'name')
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await UserModal.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
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
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModal.findByIdAndDelete(req.params.id);
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
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAndBankUserById,
};
