const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const passport = require("passport");

//Import and use authentication strategy from config file
jwtStrategy = require("../config/passport");
passport.use(jwtStrategy);

// Get all notifications for a user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    Notification.find({ userId: req.user.id })
      .then((notifications) => res.json(notifications))
      .catch((err) =>
        res.status(500).json({ message: "Error fetching notifications", err })
      );
  }
);

// Create a new notification
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { content, noticeDate, read } = req.body;

    const newNotification = new Notification({
      userId: req.user.id,
      content: content,
      noticeDate: noticeDate,
      read: read,
    });
    newNotification
      .save()
      .then((notification) => res.json(notification))
      .catch((err) =>
        res.status(500).json({ message: "Error creating notification", err })
      );
  }
);

// Update the read status of a notification, use notification id as request parameter
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Notification.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    )
      .then((notification) => res.json(notification))
      .catch((err) =>
        res.status(500).json({ message: "Error updating notification", err })
      );
  }
);

module.exports = router;
