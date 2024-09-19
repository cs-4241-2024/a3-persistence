// FRONT-END (CLIENT) JAVASCRIPT HERE


const add = async function(event) {
    event.preventDefault();

    const input = {
      MatchType:document.querySelector('input[name="match-type"]:checked'),
      MatchFormat:document.querySelector('input[name="match-format"]:checked'),
      Match:document.getElementById('match'),
      SchoolA:document.getElementById("schoolA"),
      SchoolB:document.getElementById("schoolB"),
      PlayerA1:document.getElementById("playerA1"),
      PlayerB1:document.getElementById("playerB1"),
      PlayerA2:document.getElementById("playerA2"),
      PlayerB2:document.getElementById("playerB2"),
      Game1A:document.getElementById("game1A"),
      Game1B:document.getElementById("game1B"),
      Game2A:document.getElementById("game2A"),
      Game2B:document.getElementById("game2B"),
      Game3A:document.getElementById("game3A"),
      Game3B:document.getElementById("game3B"),
    },
    json = {
        MatchType: input.MatchType.value,
        MatchFormat: input.MatchFormat.value,
        Match: input.Match.value,
        SchoolA: input.SchoolA.value,
        SchoolB: input.SchoolB.value,
        PlayerA1: input.PlayerA1.value,
        PlayerB1: input.PlayerB1.value,
        PlayerA2: input.PlayerA2.value,
        PlayerB2: input.PlayerB2.value,
        Game1A: input.Game1A.value,
        Game1B: input.Game1B.value,
        Game2A: input.Game2A.value,
        Game2B: input.Game2B.value,
        Game3A: input.Game3A.value,
        Game3B: input.Game3B.value,
    },
    body = JSON.stringify( json )
    console.log(body)

    const response = await fetch( '/add', {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })
    const data = await response.json()
    console.log(data)
    await generateMatches()
}

const addMatch = function(data) {
    const matchContainer = document.getElementById('matches-container'); // Assuming you have a container to append the matches

    const matchHTML = `
    <div id="Example-Match" class="fixed-grid">
      <div class="grid">
        <div class="cell match-info is-col-span-3 is-inline is-size-5">
          <p class="is-inline is-size-4">${data.SchoolA} -</p>
          <p class="is-inline is-size-4">${data.SchoolB} -</p>
          <p class="is-inline is-size-4"> ${data.Match}</p>
        </div>

        <div class="cell is-col-start-1">
          <div>
            <p class="is-inline-block">${data.SchoolA}</p>
            <p class="is-inline-block">✔</p>
          </div>
          <div>
            <p class="is-inline">${data.PlayerA1}</p>
            <p class="is-inline"> / </p>
            <p class="is-inline-block">${data.PlayerA2}</p>
          </div>
        </div>
        <div class="cell columns is-gapless is-flex ">
          <p class="column is-size-3">${data.Game1A}</p>
          <p class="column is-size-3">${data.Game2A}</p>
          <p class="column is-size-3">${data.Game3A}</p>
        </div>
        <button class="cell is-1-one-fifth button is-warning">Edit</button>

        <div class="cell is-col-start-1">
          <div>
            <p class="is-inline-block">${data.SchoolB}</p>
            <p class="is-inline-block">✔</p>
          </div>
          <div>
            <p class="is-inline">${data.PlayerB1}</p>
            <p class="is-inline"> / </p>
            <p class="is-inline-block">${data.PlayerB2}</p>
          </div>
        </div>
        <div class="cell columns is-gapless is-flex is-justify-content-space-between">
          <h3 class="column is-size-3">${data.Game1B}</h3>
          <h3 class="column is-size-3">${data.Game2B}</h3>
          <h3 class="column is-size-3">${data.Game3B}</h3>
        </div>
        <button class="cell is-1-one-fifth button is-danger">Delete</button>
      </div>
    </div>
  `;

    matchContainer.insertAdjacentHTML('beforeend', matchHTML);
};

const generateMatches = async function() {
    const matchContainer = document.getElementById('matches-container'); // Assuming you have a container to append the matches
    matchContainer.innerHTML = '';
    const response = await fetch( '/docs', {
        method:'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    let jsonData = await response.json();
    jsonData.forEach(match => {
        addMatch(match)
    });

}




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
    headers: { 'Content-Type': 'application/json' },
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
    method:'PUT',
    headers: { 'Content-Type': 'application/json' },
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
  const addButton = document.getElementById("add");
  addButton.onclick = add;

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
    method:'GET'
  })

  const jsonData = await response.json()
  generateTable(jsonData)

    await generateMatches()

}
