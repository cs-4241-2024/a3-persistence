// FRONT-END (CLIENT) JAVASCRIPT HERE
const operatorSymbols = [' + ', ' - ', ' * ', ' / ']

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const firstvalue = document.querySelector( '#firstvalue' )
  const secondvalue = document.querySelector( '#secondvalue' )
  const operators = document.getElementsByName( 'operator' )
  let operator = -1
  let operatorSymbol = ''
  for (i = 0; i < operators.length; i++){
    if(operators[i].checked){
      operator = operators[i].value
      operatorSymbol = operatorSymbols[i]
    }
  }
  json = {
    firstvalue: firstvalue.value,
    secondvalue: secondvalue.value,
    operator: operator
  }

  fetch( '/submit', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify( json )
  })
  .then( response => response.json() )
  .then( result => document.getElementById( 'equation' ).innerHTML = firstvalue.value + operatorSymbol + secondvalue.value + ' = ' + result)
}

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
}