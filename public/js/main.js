let activities = [];  // Dummy activity storage
let editingIndex = null;  // Index of the activity being edited

// Function to dynamically load forms based on the selected activity type
function loadForm(activityType, activity = null) {
  const formContainer = document.getElementById('form-container');
  formContainer.style.display = 'block';
  formContainer.innerHTML = ''; // Clear any existing form

  // Load the appropriate form based on the activity type
  if (activityType === 'work') {
    formContainer.innerHTML = `
      <form id="activity-form">
        <h3>Work Form</h3>
        <label for="course">Course:</label>
        <input type="text" id="course" name="course" value="${activity ? activity.details.course : ''}" required>

        <label for="ddl">Deadline (DDL):</label>
        <input type="date" id="ddl" name="ddl" value="${activity ? activity.details.ddl : ''}" required>

        <label for="expected-time">Expected Finish Time:</label>
        <input type="time" id="expected-time" name="expected-time" value="${activity ? activity.details.expectedTime : ''}" required>

        <label for="actual-time">Actual Finish Time:</label>
        <input type="time" id="actual-time" name="actual-time" value="${activity ? activity.details.actualTime : ''}">

        <button type="submit">${editingIndex !== null ? 'Edit Work' : 'Add Work'}</button>
      </form>
    `;
  } else if (activityType === 'entertainment') {
    formContainer.innerHTML = `
      <form id="activity-form">
        <h3>Entertainment Form</h3>
        <label for="entertainment-type">Type of Entertainment:</label>
        <select id="entertainment-type" name="entertainment-type">
          <option value="video-game" ${activity && activity.details.entertainmentType === 'video-game' ? 'selected' : ''}>Video Game</option>
          <option value="music" ${activity && activity.details.entertainmentType === 'music' ? 'selected' : ''}>Music</option>
          <option value="fitness" ${activity && activity.details.entertainmentType === 'fitness' ? 'selected' : ''}>Fitness</option>
        </select>
        <button type="submit">${editingIndex !== null ? 'Edit Entertainment' : 'Add Entertainment'}</button>
      </form>
    `;
  } else if (activityType === 'sleep') {
    formContainer.innerHTML = `
      <form id="activity-form">
        <h3>Sleep Form</h3>
        <label for="sleep-date">Date of Sleep:</label>
        <input type="date" id="sleep-date" name="sleep-date" value="${activity ? activity.details.sleepDate : ''}" required>

        <label for="sleep-time">Time of Sleep:</label>
        <input type="time" id="sleep-time" name="sleep-time" value="${activity ? activity.details.sleepTime : ''}" required>

        <button type="submit">${editingIndex !== null ? 'Edit Sleep' : 'Add Sleep'}</button>
      </form>
    `;
  }

  // Attach the event listener for the form submission
  document.getElementById('activity-form').addEventListener('submit', submitActivity);
}

// Submit the activity and store it
async function submitActivity(event) {
  event.preventDefault();

  const activityType = document.querySelector('h3').innerText.split(' ')[0].toLowerCase();
  let activityData = { activityType };

  if (activityType === 'work') {
    activityData.details = {
      course: document.getElementById('course').value,
      ddl: document.getElementById('ddl').value,
      expectedTime: document.getElementById('expected-time').value,
      actualTime: document.getElementById('actual-time').value
    };
  } else if (activityType === 'entertainment') {
    activityData.details = {
      entertainmentType: document.getElementById('entertainment-type').value
    };
  } else if (activityType === 'sleep') {
    activityData.details = {
      sleepDate: document.getElementById('sleep-date').value,
      sleepTime: document.getElementById('sleep-time').value
    };
  }

  try {
    const response = await fetch(editingIndex !== null ? '/updateActivity' : '/addActivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...activityData, activityId: activities[editingIndex]?._id }) // Send ID if editing
    });

    if (!response.ok) {
      throw new Error('Failed to save activity');
    }

    alert('Activity saved successfully!');
    fetchActivities();  // Refresh the list after saving
    editingIndex = null; // Reset the editing index after saving
  } catch (error) {
    console.error('Error saving activity:', error);
  }

  // Clear the form and hide it
  document.getElementById('form-container').innerHTML = '';
  document.getElementById('form-container').style.display = 'none';
}


// Show the list of activities and allow editing or deleting
function showActivityList() {
  const activityTableBody = document.querySelector('#activity-table tbody');
  activityTableBody.innerHTML = ''; // Clear the table

  activities.forEach((activity, index) => {
    const row = activityTableBody.insertRow();
    row.insertCell(0).innerText = activity.activityType;

    let details = '';
    if (activity.activityType === 'work') {
      details = `Course: ${activity.details.course}, DDL: ${activity.details.ddl}, Expected: ${activity.details.expectedTime}, Actual: ${activity.details.actualTime}`;
    } else if (activity.activityType === 'entertainment') {
      details = `Type: ${activity.details.entertainmentType}`;
    } else if (activity.activityType === 'sleep') {
      details = `Date: ${activity.details.sleepDate}, Time: ${activity.details.sleepTime}`;
    }
    row.insertCell(1).innerText = details;

    // Edit button
    const editCell = row.insertCell(2);
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => editActivity(index);
    editCell.appendChild(editButton);

    // Delete button
    const deleteCell = row.insertCell(3);
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteActivity(activity._id);
    deleteCell.appendChild(deleteButton);
  });

  // Show the activity list table
  document.getElementById('activity-list').style.display = 'block';
}

// Load the form with existing activity data for editing
function editActivity(index) {
  const activity = activities[index];
  editingIndex = index; // Set the editing index

  loadForm(activity.activityType, activity); // Load the form with the activity data
}

// Delete an activity
async function deleteActivity(activityId) {
  const confirmed = confirm('Are you sure you want to delete this activity?');

  if (confirmed) {
    try {
      const response = await fetch('/deleteActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      alert('Activity deleted successfully!');
      fetchActivities();  // Reload the activity list
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }
}

// Fetch and display activities on initial load
async function fetchActivities() {
  try {
    const response = await fetch('/getActivities');
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    const data = await response.json();
    activities = data;  // Update the activities array with server data
    showActivityList();  // Call the function to display the activities
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
}

// Initialize and fetch activities when the page loads
window.onload = function() {
  document.getElementById('choose-work').addEventListener('click', () => loadForm('work'));
  document.getElementById('choose-entertainment').addEventListener('click', () => loadForm('entertainment'));
  document.getElementById('choose-sleep').addEventListener('click', () => loadForm('sleep'));
  document.getElementById('check-list').addEventListener('click', fetchActivities);  // Fetch activities on button click

  fetchActivities();  // Fetch activities when the page initially loads
};
