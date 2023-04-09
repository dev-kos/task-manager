const express = require("express");
const { TaskModel } = require("../models/Task");
const auth = require("../middleware/auth");
const updatesValidation = require("../utils/updatesValidation");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new TaskModel({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
  task
    .save()
    .then((task) => {
      res.send(task);
    })
    .catch((error) => {});
});

router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks");
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  updatesValidation(["isCompleted", "description"], updates, res);

  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await TaskModel.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    res.status(200).send({ message: "Task was deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = {
  taskRouter: router,
};
