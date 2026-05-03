const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  duration: String,
  image: String,
  description: String,
  seats: { type: Number, default: 20 },
  highlights: [String]
});

module.exports = mongoose.model("Tour", tourSchema);