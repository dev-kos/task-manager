const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate: (value) => {
      if (value < 18) {
        throw new Error("Age must be greater or equal 18");
      }
    },
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateWebToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretkeymy");

  user.tokens = user.tokens.concat({ token });

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
