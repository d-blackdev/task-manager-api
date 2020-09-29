const express = require("express");
require("./db/mongoose");


const app = express();
const port = process.env.PORT;
// Routers
const userRouters = require('./Routes/userRouters')
const taskRouters = require('./Routes/taskRouters')



app.use(express.json());
// userRouter
app.use(userRouters)

// taskRouter
app.use(taskRouters)




app.listen(port, () => {
  console.log("Listening to server on port " + port);
});
