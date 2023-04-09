const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { UserModel } = require("../models/User");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
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

router.patch("/users/me", auth, async (req, res) => {
  const user = req.user;
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "age", "email", "password"];
  const isValidUpdates = updates.every((update) =>
    validUpdates.includes(update)
  );

  if (!isValidUpdates) {
    return res.status(400).send({ error: "Not valid updates" });
  }

  updates.forEach((update) => (user[update] = req.body[update]));

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();

    res.status(200).send({ message: "Success logout" });
  } catch (e) {
    res.status(500).send();
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
    res.status(500).send(e);
  }
});

module.exports = {
  userRouter: router,
};
