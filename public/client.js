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
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      yourname: input,
      game: input2,
      score: input3
    })
  })
  print();
}

const del = async function ( event ) {
  event.preventDefault()
  
  const ul = document.querySelector('ul')
  ul.innerHTML = ''

  const input = document.querySelector( '#yourname' ).value
  const input2 = document.querySelector( '#game' ).value
  const input3 = document.querySelector( '#score' ).value
  
  const response = await fetch( '/delete', {
    method:'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ 
      yourname: input,
      game: input2,
      score: input3

    })
  })
  print();
}

const modify = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const ul = document.querySelector('ul')
  ul.innerHTML = ''
  
  const input = document.querySelector( '#yourname1' ).value
  const input2 = document.querySelector( '#game1' ).value
  const input3 = document.querySelector( '#score1' ).value
  const input4 = document.querySelector( '#yourname2' ).value
  const input5 = document.querySelector( '#game2' ).value
  const input6 = document.querySelector( '#score2' ).value
  
  
  const response = await fetch( '/modify', {
    method:'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      yourname1: input,
      game1: input2,
      score1: input3,
      yourname2: input4,
      game2: input5,
      score2: input6
      
    })
  })
  print();
}

const print = async function() {  
  const ul = document.querySelector('ul')
  ul.innerHTML = ''
  
  const response = await fetch( '/docs', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  })
  
  const data = await response.json()
  console.log(data)
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
  document.querySelector('#modify').onclick=modify
}
