const { BankModel } = require("./bank-model");

// Create a new bank
async function createBank(req, res) {
  const bank = new BankModel(req.body);
  try {
    const savedBank = await bank.save();
    res.status(201).json(savedBank);
  } catch (error) {
    res.status(400).json({ message: error.message, error: error.message });
  }
}

// Get all banks
async function getAllBanks(req, res) {
  try {
    const banks = await BankModel.find().sort({ createdAt: -1 });;
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
}

// Update a bank by ID
async function updateBank(req, res) {
  try {
    const updatedBank = await BankModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).sort({ createdAt: -1 });;
    res.status(200).json(updatedBank);
  } catch (error) {
    res.status(400).json({ message: error.message, error: error.message });
  }
}

// Delete a bank by ID
async function deleteBank(req, res) {
  try {
    await BankModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
}

// Get a bank by ID
async function getBankById(req, res) {
  try {
    const bank = await BankModel.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
}

// ... existing code ...

module.exports = {
  createBank,
  getAllBanks,
  updateBank,
  deleteBank,
  getBankById,
};
