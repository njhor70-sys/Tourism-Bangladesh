const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connect
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("DB Error:", err.message));

// Routes
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/tours",    require("./routes/tourRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes"));

app.get("/", (req, res) => res.send("API Running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));