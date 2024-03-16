const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/studentTasks")
  .then(() => console.log("Connected to Student Tasks database Successfully"))
  .catch(() => console.log("Unable to connect to database"));
