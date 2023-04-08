const express = require("express");
const { TaskModel } = require("../models/Task");

const router = new express.Router();

router.post("/tasks", (req, res) => {
  const task = new TaskModel(req.body);
  task
    .save()
    .then((task) => {
      res.send(task);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
    });
});

router.get("/tasks", (req, res) => {
  TaskModel.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  TaskModel.findById(_id)
    .then((task) => {
      res.send(task);
    })
    .catch(() => {
      res.status(404).send();
    });
});

module.exports = {
  taskRouter: router
}