// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function(event) {
  event.preventDefault() // stop form submission from trying to load a new .html page
  
  const entry = {
      name: document.querySelector("#name").value, // item to buy (string)
      price: document.querySelector("#price").value, // price (number)
      quantity: document.querySelector("#quantity").value, // quantity (number)
  };

  const body = JSON.stringify(entry);
  console.log(entry);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    
    if (response.ok) {
      const data = await response.json(event);
      console.log("Received data:", data);
      displayRows(); // call displayRows function after sending data
    } 
    else {
      console.error("Failed to submit data.");
    }
  } 
  
  catch (error) {
    console.error("Error:", error);
  }
};

const displayRows = async function() { // adds entries to the table, along with edit/delete button
  const tabBody = document.querySelector("#body");
  tabBody.innerHTML = "";

  const response = await fetch("/docs");
  if (!response.ok) { // check if fetch failed
    throw new Error("Failed to fetch documents.");
  }

  const dataset = await response.json(); // get entered dataset to add row

  for (const entry of dataset) {
    const tr = document.createElement("tr");

    const tdItem = document.createElement("td");
    tdItem.textContent = entry.name;
    tr.appendChild(tdItem);
 
    const tdPrice = document.createElement("td");
    tdPrice.textContent = entry.price;
    tr.appendChild(tdPrice);
    
    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = entry.quantity;
    tr.appendChild(tdQuantity);

    const tdTotal = document.createElement("td");
    tdTotal.textContent = entry.total;
    tr.appendChild(tdTotal);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editRow(entry);
    tr.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteRow(entry._id);
    tr.appendChild(deleteButton);

    tabBody.appendChild(tr);
    //console.log("entry: " + dataset);
  }
};

const deleteRow = async function(id) {
  console.log(`Attempting to delete entry with ID: ${id}`);
  try {
    const response = await fetch(`/delete/${id}`, {method: "DELETE"});
    if (response.ok) { // successfully deleted
      const data = await response.json();
      console.log("Received data:", data);
      displayRows(); // display the new data
    } else {
      console.error("Failed to delete entry.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function editRow(entry) {
  document.querySelector("#editItem").value = entry.name;
  document.querySelector("#editPrice").value = entry.price;
  document.querySelector("#editQuantity").value = entry.quantity;
  document.querySelector("#editId").value = entry._id;
  document.querySelector("#editor").style.display = "block";

  document.querySelector("#editForm").onsubmit = async function(event) {
    event.preventDefault();

    const id = document.querySelector("#editId").value;
    const updatedEntry = {
      name: document.querySelector("#editItem").value,
      price: document.querySelector("#editPrice").value,
      quantity: document.querySelector("#editQuantity").value,
    };

    try {
      const response = await fetch(`/update/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatedEntry),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Updated data:", data);
        displayRows();
        stopEdit();
      } else {
        console.error("Failed to update entry.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

function stopEdit() { // closes editing tab
  document.querySelector("#editor").style.display = "none";
}


window.onload = async function() { // make sure elements are loaded
  const button = document.querySelector("#submit");
  button.onclick = submit; // call submit when button is pressed
  
  displayRows();

  // const form = document.querySelector('#name');
  // const priceInput = document.querySelector('#price');
  // const quantityInput = document.querySelector('#quantity');
  
  //const data = await response.json();
  //displayRows(data);
  
  let taskObj = {};
  // fetch( '/data', {
  //   method:'POST',
  //   body: JSON.stringify(taskObj),// send (empty) body to server
  // }).then((response) => response.json())
  // .then((data) => { // retrieve all the data
  //     //console.log(data); // print response
  //     displayRows();
  //   })
};