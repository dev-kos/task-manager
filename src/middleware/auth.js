const { UserModel } = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decodedJwt = jwt.verify(token, "secretkeymy");
    const user = await UserModel.findOne({
      _id: decodedJwt._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Is not authenticated" });
  }
};

module.exports = auth;
