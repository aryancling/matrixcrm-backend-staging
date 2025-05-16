const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Supplier", "Contractor"] },
    name: { type: String, required: true },
    email: { type: String, unigue: true },
    mobile: { type: Number, unique: true },
    supplier_code: { type: String, unique: true },
    gst_number: { type: String },
    contact_name: { type: String },
    ifsc_code: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    documents: [
      {
        url: String,
        title: String,
      },
    ],
    servicePartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePartner",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Function to generate a unique supplier_code
async function generateUniqueSupplierCode() {
  const getRandomLetter = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const getRandomNumber = () => Math.floor(1000 + Math.random() * 9000); // 1000-9999

  let supplier_code;
  let exists = true;

  while (exists) {
    supplier_code = `${getRandomLetter()}${getRandomNumber()}`;
    exists = await mongoose.models.Supplier.exists({ supplier_code });
  }

  return supplier_code;
}

// Pre-save middleware to assign a unique supplier_code
SupplierSchema.pre("save", async function (next) {
  if (!this.supplier_code) {
    this.supplier_code = await generateUniqueSupplierCode();
  }
  next();
});

const SupplierModal = mongoose.model("Supplier", SupplierSchema);
module.exports = { SupplierModal };
