const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  isCompleted: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const TaskModel = new mongoose.model("Task", TaskSchema);

module.exports = { TaskModel };
