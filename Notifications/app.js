const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const cors = require("cors");

// Load environment variables
dotenv.config();

// Set up the MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

// Import routes
const notificationsRoutes = require("./routes/notifications");

// Initialize the app
const app = express();
app.use(express.json());
// app.use(cors());

// Register routes
app.use("/notifications", notificationsRoutes);

// Start the server
const port = process.env.PORT || 5002;
app.listen(port, () =>
  console.log(`Notification Service listening on port ${port}`)
);
