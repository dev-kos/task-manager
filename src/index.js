const express = require("express");
require("./db/mongoose");
const { userRouter } = require("./routes/userRouter");
const { taskRouter } = require("./routes/taskRouter");

const app = express();
const port = process.env.PORT | 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log("Server is starting");
});
