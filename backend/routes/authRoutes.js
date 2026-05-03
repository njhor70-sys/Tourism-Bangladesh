const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const verifyToken = require("../middleware/auth");

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidMobile(mobile) { return /^01[3-9]\d{8}$/.test(mobile); }
function isValidPin(pin) { return /^\d{4}$/.test(pin); }

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

router.post("/register", async (req, res) => {
  try {
    const { mobile, pin, name, email } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ message: "Name must be at least 2 characters." });
    if (!isValidMobile(mobile)) return res.status(400).json({ message: "Invalid mobile. Format: 01XXXXXXXXX" });
    if (!isValidPin(pin)) return res.status(400).json({ message: "PIN must be exactly 4 digits." });
    if (email && !isValidEmail(email)) return res.status(400).json({ message: "Invalid email address." });
    const existing = await User.findOne({ mobile });
    if (existing) return res.status(400).json({ message: "Mobile number already registered!" });
    const hash = await bcrypt.hash(pin, 10);
    const user = new User({ mobile, pin: hash, name: name.trim(), email: email || "" });
    await user.save();
    if (email && process.env.EMAIL_USER) {
      try {
        await getTransporter().sendMail({
          from: `"Tourism Bangladesh" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to Tourism Bangladesh!",
          html: `<h2>Welcome ${name.trim()}!</h2><p>Account created for mobile: ${mobile}</p>`
        });
      } catch (e) { console.log("Email failed:", e.message); }
    }
    res.status(201).json({ message: "Registration successful! Please login." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { mobile, pin } = req.body;
    if (!isValidMobile(mobile)) return res.status(400).json({ message: "Invalid mobile number format." });
    if (!isValidPin(pin)) return res.status(400).json({ message: "PIN must be exactly 4 digits." });
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "No account found. Please register first." });
    const match = await bcrypt.compare(pin, user.pin);
    if (!match) return res.status(401).json({ message: "Wrong PIN. Please try again." });
    const token = jwt.sign(
      { id: user._id, mobile: user.mobile, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, mobile: user.mobile, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, mobile, email, currentPin, newPin } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (name && name.trim().length >= 2) user.name = name.trim();
    if (mobile) { if (!isValidMobile(mobile)) return res.status(400).json({ message: "Invalid mobile." }); user.mobile = mobile; }
    if (email !== undefined) { if (email && !isValidEmail(email)) return res.status(400).json({ message: "Invalid email." }); user.email = email; }
    if (currentPin && newPin) {
      if (!isValidPin(newPin)) return res.status(400).json({ message: "New PIN must be 4 digits." });
      const match = await bcrypt.compare(currentPin, user.pin);
      if (!match) return res.status(401).json({ message: "Current PIN is incorrect." });
      user.pin = await bcrypt.hash(newPin, 10);
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { mobile, email } = req.body;
    if (!isValidMobile(mobile)) return res.status(400).json({ message: "Invalid mobile number." });
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "No account found with this mobile." });
    if (!user.email || user.email !== email.toLowerCase().trim())
      return res.status(400).json({ message: "Email does not match our records." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await getTransporter().sendMail({
      from: `"Tourism Bangladesh" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "PIN Reset OTP - Tourism Bangladesh",
      html: `<h2>Your OTP: <strong style="font-size:28px;letter-spacing:8px;">${otp}</strong></h2><p>Valid for 10 minutes.</p>`
    });
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP.", error: err.message });
  }
});

router.post("/reset-pin", async (req, res) => {
  try {
    const { mobile, otp, newPin } = req.body;
    if (!isValidPin(newPin)) return res.status(400).json({ message: "New PIN must be exactly 4 digits." });
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!user.resetOTP || user.resetOTP !== otp) return res.status(400).json({ message: "Invalid OTP." });
    if (new Date() > user.resetOTPExpiry) return res.status(400).json({ message: "OTP expired. Request a new one." });
    user.pin = await bcrypt.hash(newPin, 10);
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();
    res.status(200).json({ message: "PIN reset successful! Please login." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
