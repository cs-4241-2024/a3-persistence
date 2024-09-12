// // FRONT-END (CLIENT) JAVASCRIPT HERE
// //

// const response = await fetch("/delete", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body,
//   });

//   const data = await response.json();


var data = {
    rows:
        [
            {
                key: "a",
                task: "Say Hello",
                due: "2024-09-12",
                done: false,
                daysLeft: 1
            }
        ]
};

// Store a row in here when editing it
var editingRow = null;

// Get back a JSON object with the row's data
const getRowByKey = function (key) {
    for (let row of data.rows) {
        // Intentionally allowing type conversion
        if (row.key == key) {
            return row;
        }
    }
    console.log("data: ", data);
    console.log("Bad row request. Requested key: ", key);
    return null;
}

// Delete a row, identified by the key
const deleteRow = async function (key) {
    console.log("Requesting delete of row ", getRowByKey(key));

    // Check if this row was being edited
    if (editingRow != null && editingRow.children[2].firstChild.id == key) {
        console.log("Updating editingrow");
        editingRow = null;
    }

    const response = await fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key }),
    });

    const newData = await response.json();

    data = newData;

    renderData();
}

// Return a row to the state represented in data
const swapToLabel = function (row) {
    const taskInput = row.children[0];
    const dueInput = row.children[1];
    const checkbox = row.children[2].firstChild;
    const button = row.children[4];
    const rowData = getRowByKey(checkbox.id);
    const taskLabel = document.createElement("label");
    taskLabel.type = "text";
    taskLabel.innerText = rowData.task;

    const dueLabel = document.createElement("label");
    dueLabel.innerText = rowData.daysLeft;

    checkbox.disabled = false;

    const swapButton = document.createElement("button");
    swapButton.addEventListener("mousedown", () => { swapToEdit(row) });
    swapButton.innerText = "Edit";

    row.replaceChild(taskLabel, taskInput);
    row.replaceChild(dueLabel, dueInput);
    row.replaceChild(swapButton, button);
}

// Swap a row from display to edit
const swapToEdit = function (row) {
    console.log("running swapToEdit");
    if (editingRow != null) {
        swapToLabel(editingRow);
    }
    editingRow = row;
    const taskLabel = row.children[0];
    const dueLabel = row.children[1];
    const checkbox = row.children[2].firstChild;
    const editButton = row.children[4];

    console.log("checkbox", checkbox);

    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.id = "task-input";
    taskInput.value = taskLabel.innerText;

    const dueInput = document.createElement("input");
    dueInput.type = "date";
    dueInput.id = "date-input";
    dueInput.value = dueLabel.innerText;

    checkbox.disabled = "true";

    const doneButton = document.createElement("button");
    doneButton.className = "success";
    doneButton.innerText = "Done"
    doneButton.onclick = () => {
        deleteRow(checkbox.id);
        submit(taskInput.value, dueInput.value, checkbox.checked);
    }

    row.replaceChild(taskInput, taskLabel);
    row.replaceChild(dueInput, dueLabel);
    row.replaceChild(doneButton, editButton);
}

// Tick the box and tell the server
const tickBox = async function (key, value) {
    console.log("Ticking ", key, " value ", value);
    getRowByKey(key).done = value;
    const response = await fetch("/update-box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, value: value }),
    });

    data = await response.json();
    renderData();
}

const renderData = function () {
    const dataContainer = document.getElementById("data");
    dataContainer.innerHTML = "";
    for (let row of data.rows) {
        const rowElement = document.createElement("div");
        rowElement.className = "data-row";
        rowElement.innerHTML = `<label class="task">${row.task}</label>
            <label class="due-date">${row.due}</label>
            <label class="done-box"><input class="done-box" type="checkbox" id="${row.key}" checked=${row.done}><span class="checkable"></span></label>
            <label class="days-left">${row.daysLeft}</label>`
        dataContainer.appendChild(rowElement);

        const checkbox = rowElement.children[2].firstChild;
        const span = rowElement.children[2].lastChild;
        checkbox.checked = row.done;
        checkbox.addEventListener("change", () => { tickBox(row.key, checkbox.checked) });


        const swapButton = document.createElement("button");
        swapButton.addEventListener("mousedown", () => { swapToEdit(rowElement) });
        swapButton.innerText = "Edit";
        rowElement.appendChild(swapButton);

        const deleteButton = document.createElement("button");
        deleteButton.onclick = () => { deleteRow(row.key) };
        deleteButton.innerText = "Delete";
        deleteButton.className = "error";
        rowElement.appendChild(deleteButton);
    }
}

const submit = async function (task, due, done) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    // event.preventDefault();
    if (task == null || due == null) {
        task = document.getElementById("input-name").value;
        due = document.getElementById("input-date").value;
    }
    if (done == null) {
        done = false;
    }
    const json = { task, due, done },
        body = JSON.stringify(json);

    console.log("sending " + body);

    const response = await fetch("/add-new-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });

    const newData = await response.json();

    data = newData;
    console.log("New data ", data);

    renderData();
};

const get_data = async function () {
    const response = await fetch("/data", {
        method: "GET",
    });


    const newData = await response.json();

    console.log("get: ", newData);

    data = newData;

    renderData();

};

window.onload = function () {
    const newTaskButton = document.querySelector("#add-new-task");
    newTaskButton.onclick = () => { submit() };

    get_data();
};
