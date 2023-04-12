const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const jwtStrategy = require("./config/passport");
const taskRoutes = require("./routes/tasks");

// Set up the MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

// Routes
app.use("/tasks", taskRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Task Service running on port ${port}`));
