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
  .then( row => row.json() )
  .then( row => {
    createRow(row)
    createCell(firstvalue, row)
    createCell(secondvalue, row)
    createCell(operation, row)
    createCell(result, row)
    createCell("", row, true)
  })
}

const logout = function () {
  fetch( '/logout', {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  }).then(() => window.location.href = '/')
}

window.onload = function() {
  const calculate = document.getElementById( 'calculate' )
  const logoutButton = document.getElementById( 'logout' )
  calculate.onclick = submit
  logoutButton.onclick = logout

  fetch( '/table', {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  })
  //.then( response => response.json() )//response.status === 404 ? window.location.href = "/" : fillTable()} )
}

const fillTable = function(table) {
  for(let row = 0; row < table.length; row++) {
    createRow(row)
    createCell(table[row].firstvalue, row)
    createCell(table[row].secondvalue, row)
    createCell(table[row].operation, row)
    createCell(table[row].result, row)
    createCell("", row, true)
  }
}

const createRow = function(row) {
  const tr = document.createElement( 'tr' )
  tr.setAttribute( 'id' , 'r' + row )
  document.getElementById( 'tbody' ).appendChild( tr )
}

const createCell = function(data, row, button) {
  const cell = document.createElement( 'td' )
  if(!button) {
    cell.innerHTML = data
  }
  else {
    const button = document.createElement( 'button' )
    button.innerHTML = "X"
    button.style.background = "red"
    button.style.paddingInline = "4px"
    button.onclick = () => removeRow(row)
    cell.appendChild( button )
  }
  document.getElementById( 'r' + row ).appendChild( cell )
}


const removeRow = function(row) {
  row = {_id: 'r' + row}
  document.getElementById( row._id ).remove()

  fetch( '/remove', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( row )
  })
}