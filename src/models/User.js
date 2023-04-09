const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email is incorrect");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate: (value) => {
        if (value.length < 6) {
          throw new Error("Password should have at least 6 characters");
        }

        if (value === "password") {
          throw new Error("Laugh");
        }
      },
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.token;

  return userObject;
};

UserSchema.methods.generateWebToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);

  user.token = token;

  await user.save();

  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
