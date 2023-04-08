const mongoose = require("mongoose");
const { TaskModel } = require("./models/Task");
const { UserModel } = require("./models/User");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api")
  .then(() => console.log("Connected!"));

const user = new UserModel({
  name: "asdf",
  age: 18,
  email: "asdf@mail.ru",
  password: '12345678'
});

user.save().then(console.log).catch(console.error);
