// Front-end (client) JavaScript
const updateEntry = async (entry) => {
  const id = entry._id;
  const updatedEntry = {
    item: entry.item,
    notes: entry.notes,
    deadline: entry.deadline,
    done: entry.done,
  };
  try {
    const response = await fetch(`/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEntry),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Updated data:", data);
      displayTab();
      closeEditor();
    } else {
      console.error("Failed to update entry.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function openEditor(entry) {
  document.querySelector("#editItem").value = entry.item;
  document.querySelector("#editNotes").value = entry.notes;
  document.querySelector("#editDeadline").value = entry.deadline;
  document.querySelector("#editId").value = entry._id;
  document.querySelector("#editor").style.display = "block";

  document.querySelector("#editForm").onsubmit = async function (event) {
    event.preventDefault();

    const id = document.querySelector("#editId").value;
    const updatedEntry = {
      item: document.querySelector("#editItem").value,
      notes: document.querySelector("#editNotes").value,
      deadline: document.querySelector("#editDeadline").value,
    };

    try {
      const response = await fetch(`/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Updated data:", data);
        displayTab();
        closeEditor();
      } else {
        console.error("Failed to update entry.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

function closeEditor() {
  document.querySelector("#editor").style.display = "none";
}

const deleteEntry = async function (id) {
  console.log(`Attempting to delete entry with ID: ${id}`);
  try {
    const response = await fetch(`/remove/${id}`, { method: "DELETE" });
    if (response.ok) {
      const data = await response.json();
      console.log("Received data:", data);
      displayTab();
    } else {
      console.error("Failed to delete entry.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayTab = async function () {
  const tabBody = document.querySelector("#body");
  tabBody.innerHTML = "";

  const response = await fetch("/docs");
  if (!response.ok) {
    throw new Error("Failed to fetch documents.");
  }

  const dataset = await response.json();
  for (const entry of dataset) {
    const row = document.createElement("tr");

    const itemCell = document.createElement("td");
    itemCell.textContent = entry.item;
    row.appendChild(itemCell);

    const notesCell = document.createElement("td");
    notesCell.textContent = entry.notes;
    row.appendChild(notesCell);

    const deadlineCell = document.createElement("td");
    deadlineCell.textContent = entry.deadline;
    row.appendChild(deadlineCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = entry.priority;
    row.appendChild(priorityCell);

    const doneCell = document.createElement("td");
    const doneCheckbox = document.createElement("input");
    doneCheckbox.type = "checkbox";
    doneCheckbox.checked = entry.done;
    const checkboxId = `done-${entry._id}`;
    doneCheckbox.id = checkboxId;

    doneCheckbox.onchange = async () => {
      entry.done = doneCheckbox.checked;
      await updateEntry(entry);
    };

    const doneLabel = document.createElement("label");
    doneLabel.htmlFor = checkboxId;
    doneCell.appendChild(doneLabel);
    doneLabel.textContent = "Mark as done";

    doneCell.appendChild(doneCheckbox);
    row.appendChild(doneCell);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => openEditor(entry);
    row.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteEntry(entry._id);
    row.appendChild(deleteButton);

    tabBody.appendChild(row);
  }
};

const submit = async function (event) {
  event.preventDefault();

  const entry = {
    item: document.querySelector("#item").value, // Item to do (string)
    notes: document.querySelector("#notes").value, // Notes (string)
    deadline: document.querySelector("#deadline").value, // Deadline (date)
  };

  const body = JSON.stringify(entry);
  console.log(entry);

  try {
    const response = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json(event);
    if (response.ok) {
      console.log("Received data:", data);
      displayTab();
    } else {
      console.error("Failed to submit data.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

window.onload = async function () {
  const form = document.querySelector("#todoForm");
  form.onsubmit = submit;
  displayTab();

  document.getElementById("logout").addEventListener("click", async () => {
    console.log("Requesting to log out");
    try {
      const response = await fetch("/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/index.html";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });
};
