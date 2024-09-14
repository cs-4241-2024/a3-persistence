let cumulativeTotalPrice = 0;
let orderedItemsArray = []; // To store all the orders

const fetchInitialOrders = async function () {
  try {
    const response = await fetch("/orders");

    console.log(response);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Fetched orders data from backend:", data.appdata);  // Log the fetched data to verify

    // Update orderedItemsArray with the fetched orders
    orderedItemsArray = data.appdata;

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

window.onload = function () {
  // Fetch initial orders when the page loads
  fetchInitialOrders();

  console.log("Hello")

  const button = document.querySelector("button");
  button.onclick = submit;
};

const submit = async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  const nameInput = document.querySelector("#name"),
      foodInput = document.querySelector("#food"),
      quantityInput = document.querySelector("#quantity");

  if (!nameInput.value || !foodInput.value || !quantityInput.value) {
    alert("Please fill out all fields before submitting the form.");
    return; // Stop form submission if validation fails
  }

  const json = {
    name: nameInput.value,
    food: foodInput.value,
    quantity: quantityInput.value,
    cumulativeTotalPrice: cumulativeTotalPrice
  };


  const body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    body: JSON.stringify(json),
    headers: { "Content-Type": "application/json" },
  });


  const text = await response.text();
  console.log("text:", text);

  const foodOptions = {
    10: "Burger",
    5: "Fries",
    3: "Milkshake"
  };

  // Get the selected food price and food name
  const selectedFoodPrice = parseInt(foodInput.value);
  const selectedFoodName = foodOptions[selectedFoodPrice];

  // Get the quantity of the order
  const quantity = parseInt(quantityInput.value);

  // Calculate the total price for this submission
  const totalPrice = selectedFoodPrice * quantity;

  // Add the current total to the cumulative total
  cumulativeTotalPrice += totalPrice;

  // Add the current order to the array
  orderedItemsArray.push({
    name: nameInput.value,
    foodName: selectedFoodName,
    foodPrice: selectedFoodPrice,
    quantity: quantity
  });

  // Update the total price field with the cumulative total
  const totalPriceField = document.querySelector("#totalPriceField");
  totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

  // Render the ordered items in the list
  renderOrderedItems();
};

// Function to render ordered items and create edit buttons
function renderOrderedItems() {
  const orderedItemsList = document.querySelector("#orderedItemsList");
  orderedItemsList.innerHTML = ''; // Clear the list before re-rendering

  orderedItemsArray.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.id = `item-${index}`;
    listItem.innerHTML = `
      <span>${item.name} ordered ${item.quantity} x ${item.foodName} ($${item.foodPrice} each)</span>
      <button onclick="editItem(${index})">Edit</button>
      <button onclick="deleteItem(${index})">Delete</button>
    `;
    orderedItemsList.appendChild(listItem);
  });
}

// Function to edit an existing order directly from the list
function editItem(index) {
  const item = orderedItemsArray[index];

  // Replace the list item with editable fields
  const listItem = document.querySelector(`#item-${index}`);

  listItem.innerHTML = `
    <input type="text" id="editName-${index}" value="${item.name}" />
    <select id="editFood-${index}">
      <option value="10" ${item.foodPrice === 10 ? 'selected' : ''}>Burger ($10)</option>
      <option value="5" ${item.foodPrice === 5 ? 'selected' : ''}>Fries ($5)</option>
      <option value="3" ${item.foodPrice === 3 ? 'selected' : ''}>Milkshake ($3)</option>
    </select>
    <input type="number" id="editQuantity-${index}" value="${item.quantity}" min="1" max="5" />
    <button onclick="saveItem(${index})">Save</button>
    <button onclick="cancelEdit(${index})">Cancel</button>
  `;
}

// Function to save the edited item
async function saveItem(index) {
  const nameInput = document.querySelector(`#editName-${index}`).value;
  const foodPrice = parseInt(document.querySelector(`#editFood-${index}`).value);
  const quantity = parseInt(document.querySelector(`#editQuantity-${index}`).value);

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
      index: index,
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
    // Update the order locally only if the update was successful on the server
    cumulativeTotalPrice -= orderedItemsArray[index].foodPrice * orderedItemsArray[index].quantity;
    cumulativeTotalPrice += foodPrice * quantity;

    orderedItemsArray[index] = {
      name: nameInput,
      foodName: foodName,
      foodPrice: foodPrice,
      quantity: quantity,
    };

    // Update the total price field in the UI
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    renderOrderedItems();
  }
}

// Function to delete an item from the list
async function deleteItem(index) {
  // Send a DELETE request to the server
  const response = await fetch(`/delete`, {
    method: "DELETE",
    body: JSON.stringify({ index: index }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();
  console.log(result.message);

  // Remove the item locally only if the deletion was successful on the server
  if (response.ok) {
    // Adjust the cumulative total price by subtracting the price of the deleted item
    const deletedItem = orderedItemsArray[index];
    cumulativeTotalPrice -= deletedItem.foodPrice * deletedItem.quantity;

    // Remove the item locally from orderedItemsArray
    orderedItemsArray.splice(index, 1);

    // Update the total price field on the frontend
    const totalPriceField = document.querySelector("#totalPriceField");
    totalPriceField.innerHTML = `<h3>Cumulative Total Price: $${cumulativeTotalPrice}</h3>`;

    // Re-render the list of orders
    renderOrderedItems();
  }
}