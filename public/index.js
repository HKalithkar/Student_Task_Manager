const today = new Date().toISOString().split('T')[0];
document.querySelector("input#dueDate").min = today;

const addTask = document.querySelector("button.add");
const newTask = document.querySelector(".newTask");
addTask.addEventListener("click", () => {
    newTask.classList.toggle("hidden");
});

const tasks = document.getElementById("tasks");

fetch("http://localhost:3000/tasks")
.then(res => res.json())
.then((data) => {
    data.map((task) => {
        const newDiv = document.createElement("div");
        const date = task.dueDate.substring(0, 10);
        let statusInfo;
        function initialStatus() {
            if(task.status) {
                statusInfo = {
                    text: "Completed",
                    color: "green"
                }
            }
            else {
                statusInfo = {
                    text: "Mark as Completed",
                    color: "red"
                }
            }
        }
        initialStatus()
        newDiv.innerHTML = `
            <h3>Course Id: <span class="courseId">${task.courseId}</span></h3>
            <p>${task.taskName}</p>
            <p>${task.taskDescription}</p>
            <p id="due">due by ${date}</p>
            <div class="task-buttons">
                <button class="status" onclick="status(this)" style="background-color: ${statusInfo.color}">${statusInfo.text}</button>
                <button class="delete" onclick="del(this)" style="background-color: red">Delete</button>
            </div>
        `
        tasks.appendChild(newDiv);
    })
})

function del(button) {
    const taskDiv = button.parentNode.parentNode;
    const taskName = taskDiv.querySelector("p").textContent;
    fetch(`http://localhost:3000/tasks/del/${taskName}`, {
        method: "DELETE"
    });
    location.reload();
}

function status(button) {
    const taskDiv = button.parentNode.parentNode;
    const taskName = taskDiv.querySelector("p").textContent;
    fetch(`http://localhost:3000/tasks/updateStatus/${taskName}`, {
        method: "PATCH"
    });
    location.reload();
}

function showAll() {
    location.reload();
}

function showComplete() {
    const allTasks = document.querySelectorAll("#tasks > div");
    console.log(allTasks.length);
    for(let i=0; i<allTasks.length; i++) {
        const currStatus = allTasks[i].querySelector(".status").textContent;
        if(currStatus == "Completed") {
            allTasks[i].classList.remove("hidden");
        }
        else {
            allTasks[i].classList.add("hidden");
        }
    }
}

function showIncomplete() {
    const allTasks = document.querySelectorAll("#tasks > div");
    for(let i=0; i<allTasks.length; i++) {
        const currStatus = allTasks[i].querySelector(".status").textContent;
        console.log(currStatus);
        if(currStatus == "Completed") {
            allTasks[i].classList.add("hidden");
        }
        else {
            allTasks[i].classList.remove("hidden");
        }
    }
}

const forms = document.querySelectorAll("form");
for(let i=0; i<forms.length; i++) {
    forms[i].addEventListener("submit", (e) => {
        e.preventDefault();
    })
}

const newTaskForm = document.querySelector(".newTask form");
const newTaskSubmit = document.querySelector(".newTask button");
newTaskForm.addEventListener("submit", () => {
    const newTask = {
        "courseId": parseInt(newTaskForm.querySelectorAll("input")[0].value.trim()),
        "taskName": newTaskForm.querySelectorAll("input")[1].value.trim(),
        "taskDescription": newTaskForm.querySelector("textarea").value.trim(),
        "dueDate": newTaskForm.querySelectorAll("input")[2].value.trim()
    }
    console.log(newTask);
    fetch("http://localhost:3000/newTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })
    location.reload();
})

const fetchTaskForm = document.querySelector(".fetchTask form");
const fetchTaskSubmit = document.querySelector(".fetchTask button");
fetchTaskSubmit.addEventListener("click", () => {
    const allTasks = document.querySelectorAll("#tasks > div");
    const id = fetchTaskForm.querySelector("input").value.trim();
    for(let i=0; i<allTasks.length; i++) {
        const currId = allTasks[i].querySelector(".courseId").textContent;
        if(currId == id) {
            allTasks[i].classList.remove("hidden");
        }
        else {
            allTasks[i].classList.add("hidden");
        }
    }
    fetchTaskForm.querySelector("input").value = "";
})