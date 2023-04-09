const mongoose = require("mongoose");
const { TaskModel } = require("./models/Task");
const { UserModel } = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected!"));

