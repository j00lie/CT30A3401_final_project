const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ email, password });
    newUser
      .save()
      .then((user) =>
        res.json({ message: "User registered successfully", user })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error registering user", err })
      );
  });
});

// Authenticate a user and return a JWT token
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error generating token", err });
        }
        res.json({ token: "Bearer " + token });
      }
    );
  });
});

// Get the authenticated user's data
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, email: req.user.email });
  }
);

module.exports = router;
