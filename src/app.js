const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const port = 3000;
const studentTasks = require("./models/studentTasks");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Student Task Manager</h1>");
});

app.get("/tasks", async (req, res) => {
    try {
        const data = await studentTasks.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send("<h1>Page not found</h1>");
    }
});

app.post("/newTask", async (req, res) => {
    try {
        const data = await studentTasks.create(req.body);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send("<h1>Error 404</h1>");
    }
});

app.delete("/tasks/del/:taskName", async (req, res) => {
    try {
        const taskName = req.params.taskName;
        const data = await studentTasks.findOneAndDelete({taskName});
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send("<h1>Error 404</h1>");
    }
});

app.patch("/tasks/updateStatus/:taskName", async (req, res) => {
    try {
        const taskName = req.params.taskName;
        const data = await studentTasks.find({taskName});
        const currStatus = data[0].status;
        await studentTasks.findOneAndUpdate({taskName}, {status: !currStatus});
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send("<h1>Error 404</h1>");
    }
})

app.listen(port, () => {
    console.log(`Server is now listening in ${port}`);
});