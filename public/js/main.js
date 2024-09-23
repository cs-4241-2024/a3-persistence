// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#exercise' ),
        input2 = document.querySelector('#reps'),
        input3 = document.querySelector('#sets'),
        input4 = document.querySelector('#weight'),
        json = { exercise: input.value,  reps: input2.value, sets: input3.value, weight: input4.value},
        body = JSON.stringify( json );


  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },  // Ensure JSON is sent properly
    body
  })
  
  const text = await response.json()
  console.log( 'text:', text )
  console.log( 'text:' +  JSON.stringify(text) )

  console.log('type of text ' + typeof(text))

  //Resets the values in the inputs
  document.getElementById('exercise').value = ""
  document.getElementById('reps').value = ""
  document.getElementById('sets').value = ""
  document.getElementById('weight').value = ""
  document.getElementById('exercise').focus();

  console.log('Stuff to build the table ' + text)
  buildTable(text) //to build the table
}

//This builds the table
function buildTable(text){
  const table = document.getElementById('results')
  while (table.firstChild) {
    table.removeChild(table.firstChild)
  }
  
  const thead = document.createElement('thead');
  const row = document.createElement('tr');

  const headers = ['Exercise', 'Sets', 'Reps', 'Weight', 'Total Weight', 'Update', 'Delete'];
  headers.forEach(headerText => {
  const th = document.createElement('th');
  th.textContent = headerText;
  row.appendChild(th);
  });

thead.appendChild(row);
table.appendChild(thead);
  text.forEach((rowData, index) =>{
    const row = document.createElement('tr');
    
    const exerciseCell = document.createElement('td')
    exerciseCell.textContent = rowData.exercise
    exerciseCell.contentEditable = "true"

    const setsCell = document.createElement('td')
    setsCell.textContent = rowData.sets
    setsCell.contentEditable = "true"

    const repsCell = document.createElement('td')
    repsCell.textContent = rowData.reps
    repsCell.contentEditable = "true"

    const weightCell = document.createElement('td')
    weightCell.textContent = rowData.weight
    weightCell.contentEditable = "true"

    const totalCell = document.createElement('td')
    totalCell.textContent = rowData.total

    

    const updateCell = document.createElement('td')
    const updateButton = document.createElement('button')
    updateButton.textContent = 'Update';
    updateButton.classList.add('bg-blue-400', 'text-white', 'py-1', 'px-1', 'rounded', 'hover:bg-blue-300');

    const deleteCell = document.createElement('td')
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('bg-red-500', 'text-white', 'py-1', 'px-1', 'rounded', 'hover:bg-red-400');

    
    
    console.log(rowData)
    deleteButton.onclick = function() {
      deleteRow(index, rowData);
    };

    updateButton.onclick = function(){
      updateRow(index, rowData)
    }

    row.appendChild(exerciseCell)
    row.appendChild(setsCell)
    row.appendChild(repsCell)
    row.appendChild(weightCell)
    row.appendChild(totalCell)
    updateCell.appendChild(updateButton)
    deleteCell.appendChild(deleteButton)
    row.appendChild(updateCell)
    row.append(deleteCell)

    table.appendChild(row)
  })
}

const deleteRow = async function(row){
  console.log('Delete Row ' + row)
  const response = await fetch( '/delete', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },  // Ensure JSON is sent properly
    body: JSON.stringify({index: row})
  })

  const text = await response.json()
  buildTable(text)
}


  async function updateRow(index, rowData) {
  // Find the row corresponding to the update button
  const table = document.getElementById('results');
  const row = table.rows[index + 1];  // Skip the header row, hence +1

  // Capture the edited data from the cells
  const updatedData = {
    exercise: row.cells[0].textContent.trim(),
    sets: parseInt(row.cells[1].textContent.trim()),
    reps: parseInt(row.cells[2].textContent.trim()),
    weight: parseInt(row.cells[3].textContent.trim())
  };

  // Send a POST request to the server to update the document
  const response = await fetch('/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: rowData._id,  // Pass the _id of the document to update
      updatedData: updatedData
    })
  });

  // Refresh the table with the updated data
  const newData = await response.json();
  buildTable(newData);  // Rebuild the table with the updated data from the server
}



//this should clear the page
const clearPage = async function(event){
  
  event.preventDefault()

  const response = await fetch( '/clear', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },  // Ensure JSON is sent properly
    body: JSON.stringify({obj: 1})
  })

  const text = await response.json()
  console.log( 'text:', text )

  //empties the table
  const table = document.getElementById('results')
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  document.getElementById('exercise').focus();
}

//sets the button functions onload and focuses on the first box
window.onload = async function() {
  if (document.getElementById('homePage')) {

    const submitButton = document.getElementById("submit")
    submitButton.onclick = submit;
    const clearButton = document.getElementById("clear")
    clearButton.onclick = clearPage;
    document.getElementById('exercise').focus();
  
    const response = await fetch( '/docs', {
      method:'GET'
    })
    const text = await response.json()
    buildTable(text);
  }
}