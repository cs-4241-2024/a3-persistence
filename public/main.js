// FRONT-END (CLIENT) JAVASCRIPT HERE
const operationSymbols = [' + ', ' - ', ' * ', ' / ']

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  let firstvalue = document.getElementById( 'firstvalue' ).value
  let secondvalue = document.getElementById( 'secondvalue' ).value
  const operations = document.getElementsByName( 'operation' )

  if(firstvalue === '' || secondvalue === '') {
    return
  }
  firstvalue = Number(firstvalue)
  secondvalue = Number(secondvalue)

  let operation
  let operationSymbol
  for (i = 0; i < operations.length; i++){
    if(operations[i].checked){
      operation = operations[i].value
      operationSymbol = operationSymbols[i]
    }
  }

  let result
  switch(operation) {
    case 'addition':
      result = firstvalue + secondvalue
      break
    case 'subtraction':
      result = firstvalue - secondvalue
      break
    case 'multiplication':
      result = firstvalue * secondvalue
      break
    case 'division':
      result = firstvalue / secondvalue
      break
  }

  document.getElementById( 'equation' ).innerHTML = firstvalue + operationSymbol + secondvalue + ' = ' + result

  json = {
    firstvalue: firstvalue,
    secondvalue: secondvalue,
    operation: operation,
    result: result
  }

  fetch( '/add', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( json )
  })
  .then( id => id.json() )
  .then( id => {
    createRow(id)
    createCell(firstvalue, id)
    createCell(secondvalue, id)
    createCell(operation, id)
    createCell(result, id)
    createCell("", id, true)
  })
}

const logout = function () {
  fetch( '/logout', {
    method: 'POST',
    headers: { "Content-Type": "application/json" }
  }).then( response => window.location.href = response.url )
}

window.onload = async function() {
  const calculate = document.getElementById( 'calculate' )
  const logoutButton = document.getElementById( 'logout' )
  calculate.onclick = submit
  logoutButton.onclick = logout

  fetch( '/table', {
    method: 'POST',
    headers: { "Content-Type": "application/json" }
  }).then( async response => {
    if(response.status == 400) {
      window.location.href = "/"
    } else {
      fillTable(await response.json())
    }})
}

const fillTable = function(table) {
  for(let row = 0; row < table.length; row++) {
    const id = table[row]._id
    createRow(id)
    createCell(table[row].firstvalue, id)
    createCell(table[row].secondvalue, id)
    createCell(table[row].operation, id)
    createCell(table[row].result, id)
    createCell("", id, true)
  }
}

const createRow = function(id) {
  const tr = document.createElement( 'tr' )
  tr.setAttribute( 'id' , id )
  document.getElementById( 'tbody' ).appendChild( tr )
}

const createCell = function(data, id, button) {
  const cell = document.createElement( 'td' )
  if(!button) {
    cell.innerHTML = data
  }
  else {
    const button = document.createElement( 'button' )
    button.innerHTML = "X"
    button.style.background = "red"
    button.style.paddingInline = "4px"
    button.onclick = () => removeRow(id)
    cell.appendChild( button )
  }
  document.getElementById( id ).appendChild( cell )
}


const removeRow = function(id) {
  document.getElementById( id ).remove()

  fetch( '/remove', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( {id: id} )
  })
}