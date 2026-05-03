const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Tour = require("../models/tour");
const User = require("../models/user");
const verifyToken = require("../middleware/auth");
const nodemailer = require("nodemailer");

// Email sender function
async function sendBookingEmail(toEmail, bookingDetails) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Tourism Bangladesh" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `✅ Booking Confirmed - ${bookingDetails.tourName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🌿 Tourism Bangladesh</h1>
            <p style="color: #bbf7d0; margin: 5px 0 0;">Booking Confirmation</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #166534;">✅ Your booking is confirmed!</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; color: #6b7280;">Tour</td>
                <td style="padding: 10px; font-weight: bold;">${bookingDetails.tourName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; color: #6b7280;">Name</td>
                <td style="padding: 10px;">${bookingDetails.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; color: #6b7280;">Persons</td>
                <td style="padding: 10px;">${bookingDetails.persons}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; color: #6b7280;">Payment</td>
                <td style="padding: 10px;">${bookingDetails.paymentMethod.toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #6b7280;">Total</td>
                <td style="padding: 10px; font-weight: bold; color: #16a34a; font-size: 18px;">৳${bookingDetails.totalPrice.toLocaleString()}</td>
              </tr>
            </table>
            <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">Thank you for choosing Tourism Bangladesh! Have a wonderful trip. 🎒</p>
          </div>
        </div>
      `
    });
    console.log("Email sent to:", toEmail);
  } catch (err) {
    console.log("Email send failed:", err.message);
  }
}

// POST - Create booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { tourId, name, phone, persons, paymentMethod, paymentNumber, email } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    if (tour.seats < persons) return res.status(400).json({ message: `Only ${tour.seats} seats available` });

    const totalPrice = tour.price * persons;
    const booking = new Booking({
      userId: req.user.id,
      tourId,
      tourName: tour.name,
      name,
      phone,
      persons,
      totalPrice,
      paymentMethod: paymentMethod || "cash",
      paymentNumber: paymentNumber || ""
    });
    await booking.save();
    tour.seats -= persons;
    await tour.save();

    // Send email if provided
    if (email && process.env.EMAIL_USER) {
      await sendBookingEmail(email, { tourName: tour.name, name, persons, paymentMethod: paymentMethod || "cash", totalPrice });
    }

    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET my bookings
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all bookings (admin)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;