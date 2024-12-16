const { BankUserModal } = require('./bankUser-modal'); 

// Create a new user
const createBankUser = async (req, res) => {
  try {
    const { name, mobile, userType , reportingTo } = req.body;
    const newUser = new BankUserModal({ name, mobile, userType , reportingTo });
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get all users
const getAllBankUsers = async (req, res) => {
  try {
    const users = await BankUserModal.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get a single user by ID
const getBankUserById = async (req, res) => {
  try {
    const user = await BankUserModal.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user details
const updateBankUser = async (req, res) => {
  try {
    const updatedUser = await BankUserModal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete a user
const deleteBankUser = async (req, res) => {
  try {
    const deletedUser = await BankUserModal.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
    createBankUser,
  getAllBankUsers,
  getBankUserById,
  updateBankUser,
  deleteBankUser,
};
