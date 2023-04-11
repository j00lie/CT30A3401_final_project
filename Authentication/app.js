const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const jwtStrategy = require("./config/passport");
const authRoutes = require("./routes/auth");

require("dotenv").config();

// Set up the MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

// Routes
app.use("/auth", authRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
