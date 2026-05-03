const express = require("express");
const router = express.Router();
const Tour = require("../models/tour");
const verifyToken = require("../middleware/auth");

// SEED — সবার আগে রাখতে হবে
router.get("/seed", async (req, res) => {
  try {
    await Tour.deleteMany();
    const tours = [
      { name: "Bandarban Hill Trek", location: "Bandarban", price: 4500, duration: "3 Days 2 Nights", image: "Images/bandarban.png", description: "Experience the serene hills of Bandarban.", seats: 20, highlights: ["Nilgiri Peak", "Boga Lake", "Tribal Village", "Waterfall Trek"] },
      { name: "Sajek Valley Tour", location: "Sajek, Rangamati", price: 5000, duration: "3 Days 2 Nights", image: "Images/sajek.png", description: "Walk above the clouds in Sajek Valley.", seats: 15, highlights: ["Cloud Walking", "Sunset View", "Campfire Night", "Local Culture"] },
      { name: "Rangamati Lake Cruise", location: "Rangamati", price: 3000, duration: "2 Days 1 Night", image: "Images/rangamati.png", description: "Discover the scenic beauty of Rangamati.", seats: 25, highlights: ["Kaptai Lake Cruise", "Hanging Bridge", "Tribal Market", "Waterfall"] },
      { name: "Saint Martin Island", location: "Saint Martin", price: 5500, duration: "3 Days 2 Nights", image: "Images/saintmartin.png", description: "Visit Bangladesh's only coral island.", seats: 20, highlights: ["Coral Snorkeling", "Night Sky Gazing", "Fresh Seafood", "Island Walk"] },
      { name: "Kuakata Sunrise Tour", location: "Kuakata, Patuakhali", price: 3500, duration: "2 Days 1 Night", image: "Images/kuakata.png", description: "See both sunrise and sunset from the same beach.", seats: 30, highlights: ["Sunrise View", "Sunset View", "Beach Walk", "Fish Market"] },
      { name: "Sundarbans Safari", location: "Khulna", price: 6000, duration: "3 Days 2 Nights", image: "Images/sundarban.png", description: "Explore the world's largest mangrove forest.", seats: 20, highlights: ["Tiger Safari", "Boat Ride", "Bird Watching", "Forest Walk"] },
      { name: "Sylhet Tea Garden Tour", location: "Sylhet", price: 3200, duration: "2 Days 1 Night", image: "Images/sylhet.png", description: "Walk through endless green tea gardens.", seats: 25, highlights: ["Tea Garden Walk", "Ratargul Swamp", "Jaflong", "Waterfall"] },
      { name: "Cox's Bazar Beach Holiday", location: "Cox's Bazar", price: 3500, duration: "2 Days 1 Night", image: "Images/coxbazar.jpg", description: "Relax on the world's longest sea beach.", seats: 30, highlights: ["Laboni Beach", "Himchari", "Inani Beach", "Seafood Dinner"] }
    ];
    await Tour.insertMany(tours);
    res.status(201).json({ message: `${tours.length} tours added!` });
  } catch (err) {
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

// GET all tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single tour
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST add tour
router.post("/", verifyToken, async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json({ message: "Tour added!", tour });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT update tour
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Tour updated!", tour });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE tour
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tour deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;