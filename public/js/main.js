// Load journal entries when the page loads
window.onload = async function() {
    const response = await fetch('/entries');
    const entries = await response.json();
    populateEntries(entries);
  
    const journalForm = document.getElementById('journal-form');
    journalForm.addEventListener('submit', submitJournalEntry);
  };
  
  // Submit journal entry
  async function submitJournalEntry(event) {
    event.preventDefault();
  
    const formData = {
      title: document.getElementById('title').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      entry: document.getElementById('entry').value
    };
  
    const response = await fetch('/addEntry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  
    const newEntry = await response.json();
    addEntryToTable(newEntry);
  }
  
  // Populate entries into the table
  function populateEntries(entries) {
    const tableBody = document.querySelector('#entries-table tbody');
    tableBody.innerHTML = '';
  
    entries.forEach(entry => {
      addEntryToTable(entry);
    });
  }
  
  // Add a new entry row to the table
  function addEntryToTable(entry) {
    const tableBody = document.querySelector('#entries-table tbody');
    const row = document.createElement('tr');
  
    const nextEntryDate = new Date(entry.date + 'T' + entry.time);
    nextEntryDate.setHours(nextEntryDate.getHours() + 24);
  
    row.innerHTML = `
      <td contenteditable="true">${entry.title}</td>
      <td contenteditable="true">${entry.date}</td>
      <td contenteditable="true">${entry.time}</td>
      <td contenteditable="true">${entry.entry}</td>
      <td>${nextEntryDate.toLocaleString()}</td>
      <td><button onclick="deleteEntry('${entry._id}')">Delete</button></td>
    `;
    tableBody.appendChild(row);
  }
  
  // Delete entry
  async function deleteEntry(id) {
    await fetch(`/deleteEntry/${id}`, { method: 'DELETE' });
    location.reload();
  }
  