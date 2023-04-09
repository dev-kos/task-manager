const express = require("express");
require("./db/mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/userRouter");
const { taskRouter } = require("./routes/taskRouter");

const app = express();
const port = process.env.PORT | 3000;

app.use(cors());
app.use(express.json());

// разрешаем определенные заголовки и методы
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is starting");
});