// Front-end (client) JavaScript
function openEditor(entry) {
  document.querySelector("#editItem").value = entry.item;
  document.querySelector("#editNotes").value = entry.notes;
  document.querySelector("#editDeadline").value = entry.deadline;
  document.querySelector("#editId").value = entry.id;
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
      const response = await fetch(`/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Updated data:", data);
        displayTab(data);
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
    const response = await fetch(`/delete/${id}`, { method: "DELETE" });
    if (response.ok) {
      const data = await response.json();
      console.log("Received data:", data);
      displayTab(data);
    } else {
      console.error("Failed to delete entry.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayTab = function (dataset) {
  const tabBody = document.querySelector("#body");
  tabBody.innerHTML = "";

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

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => openEditor(entry);
    row.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteEntry(entry.id);
    row.appendChild(deleteButton);

    tabBody.appendChild(row);
  }

  console.log("Table printed");
};

const submit = async function (event) {
  event.preventDefault();

  const entry = {
    item: document.querySelector("#item").value, // Item to do (string)
    notes: document.querySelector("#notes").value, // Notes (string)
    deadline: document.querySelector("#deadline").value, // Deadline (date)
  };
  const body = JSON.stringify(entry);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Received data:", data);
      displayTab(data);
    } else {
      console.error("Failed to submit data.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

window.onload = async function () {
  const button = document.querySelector("#submit");
  button.onclick = submit;
};
