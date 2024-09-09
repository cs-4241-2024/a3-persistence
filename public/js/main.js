// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const ul = document.querySelector('ul')
  ul.innerHTML = ''
  
  const input = document.querySelector( '#yourname' ).value
  const input2 = document.querySelector( '#game' ).value
  const input3 = document.querySelector( '#score' ).value
  
  
  const response = await fetch( '/submit', {
    method:'POST',
    body: JSON.stringify({
      yourname: input,
      game: input2,
      score: input3
      
    })
  })

  const data = await response.json()

  data.forEach((element) => {
    console.log(element.yourname, element.game, element.score, element.rank)
    const li = document.createElement('li')
    li.innerText = 'Name: ' + element.yourname + ', Game: ' + element.game + ', Score: ' + element.score + ', Rank: ' + element.rank + '  ';
    ul.appendChild(li)
  })
}

const del = async function ( event ) {
  event.preventDefault()
  
  const ul = document.querySelector('ul')
  ul.innerHTML = ''

  const input = document.querySelector( '#yourname' ).value
  const input2 = document.querySelector( '#game' ).value
  const input3 = document.querySelector( '#score' ).value
  
  const response = await fetch( '/delete', {
    method:'DELETE',
    body: JSON.stringify({ 
      yourname: input,
      game: input2,
      score: input3

    })
  })
  
  const data = await response.json()
  
  data.forEach((element) => {
    console.log(element.yourname, element.game, element.score, element.rank)
    const li = document.createElement('li')
    li.innerText = 'Name: ' + element.yourname + ', Game: ' + element.game + ', Score: ' + element.score + ', Rank: ' + element.rank + '  ';
    ul.appendChild(li)
  })
}

window.onload = function() {
  document.querySelector('#submit').onclick=submit
  document.querySelector('#delete').onclick=del
}
