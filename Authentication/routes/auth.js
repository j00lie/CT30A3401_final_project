const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const passport = require("passport");

//Import and use authentication strategy from config file
jwtStrategy = require("../config/passport");
passport.use(jwtStrategy);

const router = express.Router();

//Function for generating a JWT
const generateJWT = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "14d" });
};

// Register a new user
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ username, password });
    newUser
      .save()
      .then((user) =>
        res.json({
          message: "User registered successfully",
          user,
          token: generateJWT(username),
        })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error registering user", err })
      );
  });
});

// Authenticate a user and return a JWT token
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.comparePassword(password)) {
      // If password matches return jwt
      res.json(generateJWT(user.email));
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  });
});

// Get the authenticated user's data
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, username: req.user.username });
  }
);

module.exports = router;
