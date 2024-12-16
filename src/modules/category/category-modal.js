const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const CategoryModal = mongoose.model("Category", CategorySchema);
module.exports = { CategoryModal };
