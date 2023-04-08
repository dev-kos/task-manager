const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { UserModel } = require("../models/User");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);

  try {
    user.save();
    const token = await user.generateWebToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  UserModel.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(404).send();
    });
});

router.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "age", "email", "password"];
  const isValidUpdates = updates.every((update) =>
    validUpdates.includes(update)
  );

  if (!isValidUpdates) {
    return res.status(400).send({ error: "Not valid updates" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ error: "User not found (not valid id)" });
  }

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ error: "Password is incorrect!" });
    }

    const token = await user.generateWebToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = {
  userRouter: router,
};
