const express = require("express");
const router = new express.Router();

const Task = require("../model/Task");
const User = require("../model/User");
const auth = require("../middleware/auth");

// Task Creation
router.post("/task", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.send(error);
  }
});
// Get all task
router.get("/task", auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
 
//  Sorting data by createdAt 
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }  
  try {
    // const tasks = await Task.find({author:req.user._id});
    await req.user
      .populate({
        path: "tasks",
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort
        }
      })
      .execPopulate();
    if (req.user.tasks.length === 0) {
      return res.send("You have no task registered");
    }
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});
// Get task by id
router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});
// Update task
router.patch("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdates) {
    return res.status(400).send({ error: "Invalid Update Property" });
  }
  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});
//  Delete Task
router.delete("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, author: req.user._id });
    if (!task) {
      throw new Error("No such task found");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
