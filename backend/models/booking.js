const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  tourName: String,
  name: String,
  phone: String,
  persons: Number,
  totalPrice: Number,
  paymentMethod: { type: String, default: "cash", enum: ["bkash", "nagad", "rocket", "cash"] },
  paymentNumber: { type: String, default: "" },
  status: { type: String, default: "confirmed", enum: ["confirmed", "cancelled"] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);