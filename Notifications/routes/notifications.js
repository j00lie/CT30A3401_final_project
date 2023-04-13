const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get all notifications for a user
router.get("/:userId", (req, res) => {
  Notification.find({ userId: req.params.userId })
    .then((notifications) => res.json(notifications))
    .catch((err) =>
      res.status(500).json({ message: "Error fetching notifications", err })
    );
});

// Create a new notification
router.post("/", (req, res) => {
  const { userId, content } = req.body;

  const newNotification = new Notification({ userId, content });
  newNotification
    .save()
    .then((notification) => res.json(notification))
    .catch((err) =>
      res.status(500).json({ message: "Error creating notification", err })
    );
});

// Update the read status of a notification
router.put("/:id", (req, res) => {
  Notification.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read },
    { new: true }
  )
    .then((notification) => res.json(notification))
    .catch((err) =>
      res.status(500).json({ message: "Error updating notification", err })
    );
});

module.exports = router;
