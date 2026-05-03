const express = require("express");
const router = express.Router();
const Review = require("../models/review");

// ✅ Get reviews by tourId
router.get("/:tourId", async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error loading reviews" });
  }
});

// ✅ Add review
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding review" });
  }
});

module.exports = router;