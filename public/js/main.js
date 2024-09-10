// FRONT-END (CLIENT) JAVASCRIPT HERE

// Global Variable Score
let clicks = 0;
// let table = document.createElement('table')
// table add row
// table.appendChild(document.createElement('tr')).appendChild(document.createElement('th')).appendChild(document.createTextNode('Name')).parentNode.parentNode.appendChild(document.createElement('th')).appendChild(document.createTextNode('Score'))

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#yourname' ),
        json = { name: input.value, clickCount: clicks},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })
  const jsonData = await response.json()

  // Why does this promise break everything
  // const data = await response.json()
  let table = document.getElementById('table')
  table.innerHTML = ''

  clicks = 0
  let scoreElement = document.getElementById('clickCounter');
  scoreElement.textContent = clicks;
  // How to fetch from response instead
  generateTable(jsonData)
  // console.log( 'data:', data )
}



const incrementScore = function(event) {
  event.preventDefault();
  clicks += 1;

  const scoreElement = document.getElementById('clickCounter');
  scoreElement.textContent = clicks;

};

const deleteRow = async function(event) {
  event.preventDefault();

  const input = document.querySelector( '#index' ),
      json = { index: input.value },
      body = JSON.stringify( json )

  const response = await fetch( '/deleteRow', {
    method:'DELETE',
    body
  })
  const jsonData = await response.json()

  let table = document.getElementById('table')
  table.innerHTML = ''
  // How to fetch from response instead
  generateTable(jsonData)
}

const alterRow = async function(event) {
  event.preventDefault();

  const input = { index: document.getElementById( 'indexOfChange' ), name: document.getElementById("nameChange"), clickCount: document.getElementById("scoreChange") },
      json = { index: input.index.value, name: input.name.value, clickCount: input.clickCount.value },
      body = JSON.stringify( json )

  const response = await fetch( '/alterRow', {
    method:'PATCH',
    body
  })
  const jsonData = await response.json()

  let table = document.getElementById('table')
  table.innerHTML = ''
  // How to fetch from response instead
  generateTable(jsonData)
}

const generateTable = function(jsonData) {
  const tableElement = document.getElementById('table')
  tableElement.appendChild(document.createElement('tr')).appendChild(document.createElement('th')).appendChild(document.createTextNode('Index')).parentNode.parentNode.appendChild(document.createElement('th')).appendChild(document.createTextNode('Name')).parentNode.parentNode.appendChild(document.createElement('th')).appendChild(document.createTextNode('Times Clicked')).parentNode.parentNode.appendChild(document.createElement('th')).appendChild(document.createTextNode('Score'))
  for (let i = 0; i < jsonData.length; i++) {
    createNewRow(i, jsonData[i].name, jsonData[i].clickCount, jsonData[i].points, tableElement)
  }
}
const createNewRow = function (index, name, clicks, score, tableElement) {
  const row = document.createElement('tr');
  const indexCell = document.createElement('td');
  indexCell.textContent = index;
  row.appendChild(indexCell);
  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  row.appendChild(nameCell);
  const countCell = document.createElement('td');
  countCell.textContent = clicks;
  row.appendChild(countCell);
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score;
  row.appendChild(scoreCell);
  tableElement.appendChild(row);
}

window.onload = async function() {
   const button = document.getElementById("submit");
  button.onclick = submit;

  const scoreButton = document.getElementById("scoreButton")
  scoreButton.onclick=incrementScore;

  const deleteButton = document.getElementById("delete");
  deleteButton.onclick = deleteRow;

  const alterButton = document.getElementById("alter");
  alterButton.onclick = alterRow;

  const input = document.querySelector( '#yourname' ),
      json = { name: input.value, clickCount: clicks },
      body = JSON.stringify( json )
  const response = await fetch( '/getData', {
    method:'POST',
    body
  })

  const jsonData = await response.json()
  generateTable(jsonData)

}
