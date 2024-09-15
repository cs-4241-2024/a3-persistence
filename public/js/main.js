// Initialize global variables
let orderedItemsArray = [];
let cumulativeTotalPrice = 0;

// Function to fetch initial orders from the server (MongoDB)
const fetchInitialOrders = async function () {
  try {
    const response = await fetch('/orders', {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();

    // Update orderedItemsArray with the fetched orders from MongoDB
    orderedItemsArray = data.orders;

    console.log("Fetched orders:", data.orders);

    // Recalculate the cumulative total price
    cumulativeTotalPrice = orderedItemsArray.reduce(
        (total, item) => total + item.foodPrice * item.quantity,
        0
    );

    // Update the total price field
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    // Render the initial orders
    renderOrderedItems();

  } catch (error) {
    console.error("Error fetching initial orders:", error);
  }
};

// Function to render ordered items on the frontend
function renderOrderedItems() {
  const orderedItemsList = document.querySelector("#orderedItemsList");
  orderedItemsList.innerHTML = ''; // Clear the list before re-rendering

  orderedItemsArray.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.id = `item-${item._id}`; // Use _id as the identifier for the element
    listItem.innerHTML = `
      <span>${item.name} ordered ${item.quantity} x ${item.foodName} ($${item.foodPrice} each)</span>
      <button onclick="editItem('${item._id}')">Edit</button>
      <button onclick="deleteItem('${item._id}')">Delete</button>
    `;
    orderedItemsList.appendChild(listItem);
  });
}

// Function to add a new item to the list
async function addItem(event) {
  event.preventDefault(); // Prevent the form from reloading the page

  const nameInput = document.querySelector("#nameInput").value;
  const foodPrice = parseInt(document.querySelector("#foodSelect").value);
  const quantity = parseInt(document.querySelector("#quantityInput").value);

  const foodOptions = {
    10: "Burger",
    5: "Fries",
    3: "Milkshake",
  };

  const foodName = foodOptions[foodPrice];

  // Send a POST request to the server to add the new order
  const response = await fetch("/submit", {
    method: "POST",
    body: JSON.stringify({
      name: nameInput,
      foodName: foodName,
      foodPrice: foodPrice,
      quantity: quantity,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();
  console.log(result.message);

  if (response.ok) {
    // Add the newly created item (including its MongoDB _id) to the local array
    orderedItemsArray.push(result.order);

    // Recalculate cumulative total price
    cumulativeTotalPrice += foodPrice * quantity;

    // Update the total price field
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    // Re-render the list
    renderOrderedItems();
  }

  // Clear the form after submission
  document.querySelector("#orderForm").reset();

  console.log("Submitting order:", {
    name: nameInput,
    foodName: foodName,
    foodPrice: foodPrice,
    quantity: quantity
  });
  console.log("Server response:", result);
}

// Attach event listener to the form
window.onload = function() {
  //window.location.href = 'login.html';

  fetchInitialOrders();

  // Add event listener to handle form submission
  const orderForm = document.querySelector("#orderForm");
  orderForm.addEventListener("submit", addItem);
};

// Function to edit an item in the list
function editItem(id) {
  const item = orderedItemsArray.find(order => order._id === id); // Find order by _id

  // Replace the list item with editable fields
  const listItem = document.querySelector(`#item-${id}`);

  listItem.innerHTML = `
    <input type="text" id="editName-${id}" value="${item.name}" />
    <select id="editFood-${id}">
      <option value="10" ${item.foodPrice === 10 ? 'selected' : ''}>Burger ($10)</option>
      <option value="5" ${item.foodPrice === 5 ? 'selected' : ''}>Fries ($5)</option>
      <option value="3" ${item.foodPrice === 3 ? 'selected' : ''}>Milkshake ($3)</option>
    </select>
    <input type="number" id="editQuantity-${id}" value="${item.quantity}" min="1" max="5" />
    <button onclick="saveItem('${id}')">Save</button>
    <button onclick="cancelEdit('${id}')">Cancel</button>
  `;
}

// Function to save the edited item
async function saveItem(id) {
  const nameInput = document.querySelector(`#editName-${id}`).value;
  const foodPrice = parseInt(document.querySelector(`#editFood-${id}`).value);
  const quantity = parseInt(document.querySelector(`#editQuantity-${id}`).value);

  const foodOptions = {
    10: "Burger",
    5: "Fries",
    3: "Milkshake",
  };

  const foodName = foodOptions[foodPrice];

  // Send a PUT request to the server with the updated item
  const response = await fetch(`/edit`, {
    method: "PUT",
    body: JSON.stringify({
      id: id,
      name: nameInput,
      foodName: foodName,
      foodPrice: foodPrice,
      quantity: quantity,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();
  console.log(result.message);

  if (response.ok) {
    // Update the order locally if the update was successful
    const updatedOrder = orderedItemsArray.find(order => order._id === id);
    updatedOrder.name = nameInput;
    updatedOrder.foodName = foodName;
    updatedOrder.foodPrice = foodPrice;
    updatedOrder.quantity = quantity;

    // Recalculate cumulative total price
    cumulativeTotalPrice = orderedItemsArray.reduce(
        (total, item) => total + item.foodPrice * item.quantity,
        0
    );

    // Update the total price field
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    // Re-render the list of orders
    renderOrderedItems();
  }
}

// Function to cancel editing an item
function cancelEdit(id) {
  renderOrderedItems(); // Re-render the list to cancel the edit
}

// Function to delete an item from the list
async function deleteItem(id) {
  // Send a DELETE request to the server
  const response = await fetch(`/delete`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();
  console.log(result.message);

  if (response.ok) {
    // Remove the item locally only if the deletion was successful on the server
    orderedItemsArray = orderedItemsArray.filter(order => order._id !== id);

    // Recalculate cumulative total price
    cumulativeTotalPrice = orderedItemsArray.reduce((total, item) => total + item.foodPrice * item.quantity, 0);

    // Update the total price field on the frontend
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    // Re-render the list of orders
    renderOrderedItems();
  }
}
