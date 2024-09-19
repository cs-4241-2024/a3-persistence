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
  })
}

window.onload = function() {
  const calculate = document.getElementById( 'calculate' )
  calculate.onclick = submit

  fetch( '/table', {
    method: 'POST',
  })
  .then( response => response.json() )
  .then( fillTable )
}

fillTable = function(table) {
  for(let row = 0; row < table.length; row++) {
    createRow(row)
    createCell(table[row].firstvalue, row)
    createCell(table[row].secondvalue, row)
    createCell(table[row].operation, row)
    createCell(table[row].result, row)
  }
}

createRow = function(row) {
  const tr = document.createElement( 'tr' )
  tr.setAttribute( 'id' , 'r' + row )
  document.getElementById( 'tbody' ).appendChild( tr )
}

createCell = function(data, row) {
  const cell = document.createElement( 'td' )
  cell.innerHTML = data
  document.getElementById( 'r' + row ).appendChild( cell )
}