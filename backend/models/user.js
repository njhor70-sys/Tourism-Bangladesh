const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  name: { type: String, default: "" },
  email: { type: String, default: "", trim: true, lowercase: true },
  resetOTP: { type: String, default: null },
  resetOTPExpiry: { type: Date, default: null }
});

module.exports = mongoose.model("User", userSchema);
