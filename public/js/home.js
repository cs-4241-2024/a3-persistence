//check if the user is authenticated after page is loads
document.addEventListener('DOMContentLoaded', function () {
  try {
    checkAuth(); // Wait for checkAuth to finish
  } catch (error) {
    return; // If authentication fails, stop here
  }

});

document.getElementById('nameForm').addEventListener('submit', function (event) {
    event.preventDefault();

    try {
      checkAuth(); // Wait for checkAuth to finish
    } catch (error) {
      return; // If authentication fails, stop here
    }
  
    // Get the name and store it in a variable
    const nameInput = document.getElementById('nameInput').value;
    // Call the addName function with the name input
    addName(nameInput);
    
    // Send the name to the server
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: nameInput}),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        fetchNames();
      })
      .catch(error => console.error('Error:', error));
  
    // Clear the input field after submitting
    document.getElementById('nameInput').value = '';
  });

  // Function to fetch the list of names from the server
  function fetchNames() {
    fetch('/getNames')
      .then(response => response.json())
      .then(data => {

        const nameList = document.getElementById('nameList');
  
        nameList.innerHTML = ''; // Clear the list before appending new names
  
        // Loop through each object in the data array
        data.forEach((item, index) => {
          const li = document.createElement('li');
  
          // Set the text content to display the guest_name and invited_by
          li.textContent = `${item.guest_name} (Invited by: ${item.invited_by})`;
  
          // Create a container for the buttons
          const buttonGroup = document.createElement('div');
          buttonGroup.classList.add('button-group');
  
          // Create a delete button for each name
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('delete-btn', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'py-1', 'px-3', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-400', 'mr-2');
          deleteButton.setAttribute('data-id', item.guest_name); 
          deleteButton.addEventListener('click', function () {
            deleteName(item.guest_name); // Call the deleteName function when the delete button is clicked
          });
          
          // Create a check-in button for each name
          const checkInButton = document.createElement('button');
          checkInButton.textContent = 'Check-In';
          checkInButton.classList.add('check-btn', 'bg-green-500', 'hover:bg-green-600', 'text-white', 'py-1', 'px-3', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-green-400', 'mr-2');
  
          // Create an edit button for each name
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.classList.add('edit-btn', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'py-1', 'px-3', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400', 'mr-2');
          editButton.addEventListener('click', function () {
            const newName = prompt(`Editing: ${item.guest_name}. Enter New Name: ` ); // Prompt the user to enter a new name
            editName(item.guest_name, newName); // Call the editName function when the edit button is clicked
          });
  
          // Append the edit and delete buttons to the button group container
          buttonGroup.appendChild(editButton);
          buttonGroup.appendChild(checkInButton);
          if (item.invited_by == sessionStorage.getItem('username')) {
            buttonGroup.appendChild(deleteButton);
          }
            
          // Append the button group to the list item
          li.appendChild(buttonGroup);
          nameList.appendChild(li);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  // Function to add a new name to the list
  function addName(name, invited_by) {
    fetch('/addName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, invited_by }) // Sending name in the request body
    })
    .then(response => response.json())
    .then(data => {
      console.log('Added:', data); // Log the added name
      fetchNames(); // Refresh the list after adding a new name
    })
    .catch(error => console.error('Error:', error));
  }

  // Function to edit a name in the list
  function editName(guestNameToEdit, newGuestName) {
    fetch('/editName', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guest_name: guestNameToEdit, newGuestName }) // Send guest_name in the request body
    })
      .then(response => response.json())
      .then(data => {
        console.log('Edited:', data); // Log the edited guest's name
        fetchNames(); // Refresh the list after editing
      })
      .catch(error => console.error('Error:', error));
  }
  
  // Function to delete a name from the list
  function deleteName(guestNameToDelete) {
    fetch('/deleteName', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guest_name: guestNameToDelete }) // Send guest_name in the request body
    })
      .then(response => response.json())
      .then(data => {
        console.log('Deleted:', data); // Log the deleted guest's name
        fetchNames(); // Refresh the list after deletion
      })
      .catch(error => console.error('Error:', error));
}
// Function to fetch the initial orders
const checkAuth = async function () {
  try {
    const response = await fetch('/protected', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    console.log('User is authenticated');

  } catch (error) {
    alert('Not authenticated, redirecting to login page');
    console.error('User not authenticated:', error);
    // Redirect to login page if not authenticated
    window.location.href = '/index.html';
  }
};

  // Fetch names on page load
  fetchNames();
  