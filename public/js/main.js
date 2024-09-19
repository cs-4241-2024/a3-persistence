// function for updating the product table on the UI side
const updateTable = async function() {
  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify({ action: 'get' }),
    headers: { 'Content-Type': 'application/json' }
  });

  // check if the response is HTML (unauthenticated redirect)
  // was getting a lot of issues
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    window.location.href = '/login.html';  // Redirect to login if HTML is returned
    return;
  }

  // retrieving data
  const data = await response.json();
  const tableBody = document.querySelector('#productsTable tbody');
  tableBody.innerHTML = ''; // Clear the table
  data.forEach(p => {
    const newRow = document.createElement('tr');
    // create a new row of data in the table
    newRow.innerHTML = `
      <td>${p.product}</td>
      <td>${p.releaseYear}</td>
      <td>${p.releaseCost}</td>
      <td>${p.currentCost}</td>
    `;
    tableBody.appendChild(newRow);
  });
};

// function for retrieving product data and adding it to the
// database
const addProduct = async function (event) {
  event.preventDefault();

  // take in user input
  const product = document.querySelector('#product').value;
  const releaseYear = document.querySelector('#releaseYear').value;
  const releaseCost = document.querySelector('#releaseCost').value;
  const currentCost = 0;
  
  // create a data constant with the user-inputted values
  const data = {
    action: 'add',
    product,
    releaseYear: parseInt(releaseYear),
    releaseCost: parseInt(releaseCost),
    currentCost: parseInt(currentCost)
  };
  
  // use fetch to send a post request
  // and convert data into a json string
  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
  
  // wait for unauthentication response from server
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    window.location.href = '/login.html';  // Redirect to login if HTML is returned
    return;
  }
  
  // update the table if the server does not send the user
  // back to the login screen
  await updateTable();
};

// function for deleting products from the table
const deleteProduct = async function (event) {
  event.preventDefault();
  
  // retrieve product name for deletion
  const product = document.querySelector('#productName').value;
  
  const data = {
    action: 'delete',
    product
  };
  
  try {
    const response = await fetch('/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // wait for unauthentication response from server
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      window.location.href = '/login.html';  // Redirect to login if HTML is returned
      return;
    }
    
    // wait for normal response from server
    const result = await response.json();
    if (result.status === 'deleted') {
      // if the data is deleted, update the table
      await updateTable();
    } else {
      console.error('Failed to delete product:', result);
    }
  } catch (error) {
    console.error('Error during deletion:', error);
  }
};

// function for editing products in the product table
const editProduct = async function (event) {
  event.preventDefault();
  
  // retrieving data needed to edit a product
  const product = document.querySelector('#productForEditing').value;
  const releaseYear = document.querySelector('#releaseYearForEditing').value;
  const releaseCost = document.querySelector('#releaseCostForEditing').value;
  
  // creating a data constant with the values we want edited into the table
  const data = {
    action: 'edit',
    product,
    releaseYear: parseInt(releaseYear),
    releaseCost: parseFloat(releaseCost)
  };
  
  // use fetch to send a post request
  // and convert data into a json string
  const response = await fetch('/submit', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
  
  // check if the data was successfully edited
  const result = await response.json();
  if (result.status === 'success') {
    // update table to show edits
    await updateTable();
  } else {
    console.error('Error editing product:', result.message);
  }
};

window.onload = function () {
  updateTable();

  const addProductForm = document.querySelector('.Form');
  const deleteProductForm = document.querySelector('#deleteForm');
  const editProductForm = document.querySelector('#editProductForm');

  addProductForm.onsubmit = addProduct;
  deleteProductForm.onsubmit = deleteProduct;
  editProductForm.onsubmit = editProduct;
};
