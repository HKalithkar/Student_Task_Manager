const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    courseId: Number,
    taskName: String,
    taskDescription: String,
    dueDate: Date,
    status: {
        type: Boolean,
        default: false
    }
});

const studentTasks = new mongoose.model("Student Tasks", taskSchema);
module.exports = studentTasks;