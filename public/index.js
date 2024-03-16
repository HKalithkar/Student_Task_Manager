const today = new Date().toISOString().split('T')[0];               //Today's date
const year = new Date().getFullYear();                              //Current Year
const addTask = document.querySelector("button.add");               //Add Task Button
const newTask = document.querySelector(".newTask");                 //Add Task Form div
const tasks = document.getElementById("tasks");                     //Tasks
const forms = document.querySelectorAll("form");                    //All form elements
const newTaskForm = document.querySelector(".newTask form");        //Add Task Form
const newTaskSubmit = document.querySelector(".newTask button");    //Add Task Form Submit Button
const fetchTaskForm = document.querySelector(".fetchTask form");    //Form to fetch asked CourseID tasks
const fetchTaskSubmit = document.querySelector(".fetchTask button");//Submit button to fetch asked CourseID tasks
const footerYear = document.querySelector("span.year");             //Footer span to dynamically change year

//Fetch all tasks from database and display in frontend

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
});

//To toggle new task form 

addTask.addEventListener("click", () => {
    newTask.classList.toggle("hidden");
});

//To prevent default of forms on submit

for(let i=0; i<forms.length; i++) {
    forms[i].addEventListener("submit", (e) => {
        e.preventDefault();
    });
}

//To make sure user doesn't select previous date when adding due date in new task form

document.querySelector("input#dueDate").min = today;

//Adding a new task

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
});

//To display tasks for the mentioned courseId only

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

//To display all tasks

function showAll() {
    location.reload();
}

//To display all tasks whose status is true (completed tasks)

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

//To display all tasks whoste status is false (incomplete tasks)

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

//Delete function to delete a task

function del(button) {
    const taskDiv = button.parentNode.parentNode;
    const taskName = taskDiv.querySelector("p").textContent;
    fetch(`http://localhost:3000/tasks/del/${taskName}`, {
        method: "DELETE"
    });
    location.reload();
}

//This function changes the status of task to either true or false

function status(button) {
    const taskDiv = button.parentNode.parentNode;
    const taskName = taskDiv.querySelector("p").textContent;
    fetch(`http://localhost:3000/tasks/updateStatus/${taskName}`, {
        method: "PATCH"
    });
    location.reload();
}

//Dynamically changing year in footer

footerYear.textContent = year;