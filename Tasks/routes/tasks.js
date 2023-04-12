const express = require("express");
const passport = require("passport");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks for the authenticated user
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Task.find({ userId: req.user.id })
      .then((tasks) => res.json(tasks))
      .catch((err) =>
        res.status(500).json({ message: "Error fetching tasks", err })
      );
  }
);

// Create a new task for the authenticated user
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, description } = req.body;

    const newTask = new Task({ userId: req.user.id, title, description });
    newTask
      .save()
      .then((task) => res.json(task))
      .catch((err) =>
        res.status(500).json({ message: "Error creating task", err })
      );
  }
);

// Update a task for the authenticated user
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, description, completed } = req.body;

    Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { title, description, completed } },
      { new: true }
    )
      .then((task) => {
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
      })
      .catch((err) =>
        res.status(500).json({ message: "Error updating task", err })
      );
  }
);

// Delete a task for the authenticated user
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
      .then((task) => {
        if (!task) {
          return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted", task });
      })
      .catch((err) =>
        res.status(500).json({ message: "Error deleting task", err })
      );
  }
);

module.exports = router;
