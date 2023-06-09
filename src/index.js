const express = require("express");
require("./db/mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/userRouter");
const { taskRouter } = require("./routes/taskRouter");

const app = express();
const port = process.env.PORT | 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is starting");
});
