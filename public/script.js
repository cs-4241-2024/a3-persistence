// FRONT-END (CLIENT) JAVASCRIPT HERE

// get all tasks from database
const docs = async function () {
  const form = document.querySelector("#tasklist");
  form.innerHTML = "";

  // Must check if response is ok
  try {
    const response = await fetch("/docs", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // get request cannot have a body
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else {
      let count = 0;
      const data = await response.json();
      data
        .map((item) => item)
        .forEach((item) => {
          const element = document.createElement("div");
          element.classList.add(
            "form-check",
            "bg-dark",
            "text-white",
            "border",
            "border-4",
            "border-warning-subtle",
            "mt-2",
            "py-2",
            "rounded"
          );

          element.innerHTML =
            "<div class='container'> <input aria-label='Checkbox to delete task' class='form-check-input' type='checkbox' name='" +
            `${item._id}` +
            "' id='Checkbox" +
            `${count}` +
            "' onclick='rmv(event)'/> " +
            "<label class='form-label' for='Checkbox" +
            `${count}` +
            "'>Complete</label></div><div class='container'><label for='task" +
            `${count}` +
            "' class='form-label pt-2'>Task</label><input aria-label='Enter a task' type='text' class='form-control' id='task" +
            `${count}` +
            "' value='" +
            `${item.task}` +
            "' />" +
            "</div><div class='input-group container mb-3> <div class='input-group mb-3'><label class='input-group-text' for='updatePriority" +
            `${count}` +
            "'>Priority</label><select aria-label='Select a task priortity' class='form-select' id='updatePriority" +
            `${count}` +
            "'><option selected value='" +
            `${item.priority}` +
            "'>" +
            `${item.priority}` +
            "</option><option aria-label='High priority' value='High'>High</option><option aria-label='Medium priority' value='Medium'>Medium</option><option aria-label='Low priority' value='Low'>Low</option></select></div>" +
            "<fieldset disabled><div class='container mt-2'><label for='daydue' class='form-label'>Due:</label><input type='text' id='daydue' class='form-control' aria-label='Disabled field displaying day task is due' placeholder='" +
            `${item.date} ` +
            "'></div></fieldset>" +
            "<div class='container'><button aria-label='Button to update task' onclick='updates(event)' class='btn btn-warning btn-sm mt-3' name='" +
            `${count}` +
            "'>update</button></div>";

          form.appendChild(element);
          count++;
        });
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Add task to db
const add = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  // Clear the form when submit is hit (with flicker)
  const form = document.querySelector("#tasklist");
  form.innerHTML = "";

  // Data processing before sending to the db
  const date0 = new Date();
  let date = date0.getDay();

  const input = document.querySelector("#newtask");
  const input2 = document.querySelector("#priority");

  if (input2.value === "High") {
    let newDate = date + 1;
    if (newDate === 7) {
      newDate = 0;
    }

    date = newDate;
  } else if (input2.value === "Medium") {
    let i = 0;
    for (i = 0; i < 3; i++) {
      let newDate = date + 1;
      if (newDate === 7) {
        newDate = 0;
      }
      date = newDate;
    }
  } else if (input2.value === "Low") {
    let j = 0;
    for (j = 0; j < 7; j++) {
      let newDate = date + 1;
      if (newDate === 7) {
        newDate = 0;
      }
      date = newDate;
    }
  }

  switch (date) {
    case 0:
      date = "Sunday";
      break;
    case 1:
      date = "Monday";
      break;
    case 2:
      date = "Tuesday";
      break;
    case 3:
      date = "Wednesday";
      break;
    case 4:
      date = "Thursday";
      break;
    case 5:
      date = "Friday";
      break;
    case 6:
      date = "Saturday";
  }

  const json = {
      task: input.value,
      date: date,
      priority: input2.value,
    },
    body = JSON.stringify(json);

  const response = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  // update screen after adding
  docs();
};

// Remove Task from db
const rmv = async function (event) {
  event.preventDefault();

  const response = await fetch("/rmv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: event.target.getAttribute("name") }),
  });

  // update screen after deleting
  docs();
};

// update task on database
const updates = async function (event) {
  event.preventDefault();

  const date0 = new Date();
  let date = date0.getDay();

  const elNum = event.target.getAttribute("name");

  let id = document.querySelector("#Checkbox" + `${elNum}`);
  id = id.getAttribute("name");

  const input = document.querySelector("#task" + `${elNum}`);
  const input2 = document.querySelector("#updatePriority" + `${elNum}`);

  if (input2.value === "High") {
    let newDate = date + 1;
    if (newDate === 7) {
      newDate = 0;
    }

    date = newDate;
  } else if (input2.value === "Medium") {
    let i = 0;
    for (i = 0; i < 3; i++) {
      let newDate = date + 1;
      if (newDate === 7) {
        newDate = 0;
      }
      date = newDate;
    }
  } else if (input2.value === "Low") {
    let j = 0;
    for (j = 0; j < 7; j++) {
      let newDate = date + 1;
      if (newDate === 7) {
        newDate = 0;
      }
      date = newDate;
    }
  }

  switch (date) {
    case 0:
      date = "Sunday";
      break;
    case 1:
      date = "Monday";
      break;
    case 2:
      date = "Tuesday";
      break;
    case 3:
      date = "Wednesday";
      break;
    case 4:
      date = "Thursday";
      break;
    case 5:
      date = "Friday";
      break;
    case 6:
      date = "Saturday";
  }

  const json = {
      _id: id,
      task: input.value,
      date: date,
      priority: input2.value,
    },
    body = JSON.stringify(json);

  const response = await fetch("/updates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  // update screen after updating a task
  docs();
};

window.onload = function () {
  const button = document.querySelector("#add");
  button.onclick = add;
  // get all results when the window loads
  docs();
};
