const express = require("express");
require("./db/mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/userRouter");
const { taskRouter } = require("./routes/taskRouter");

const app = express();
const port = process.env.PORT | 3000;

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is starting");
});
