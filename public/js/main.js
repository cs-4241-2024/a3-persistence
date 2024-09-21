// FRONT-END (CLIENT) JAVASCRIPT HERE

let recent_attempt = 1;


const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#password_entry' ),
        json = { password_entry: input.value },
        body = JSON.stringify( json )

  

  const table = document.getElementById("password_attempts");
  
  let response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  let text = await response.json();
  
  for(let j = 1; j < document.getElementById("password_attempts").rows.length - 1; j++)
  {
    table.deleteRow(j);
  }
  
  console.log(text);
  
  
  for(let j = 0; j < text.length; j++)
  {
    let correct = text[j].correct;
    let password_entered = text[j].password_entry;
    let num_correct_letters = text[j].num_correct_letters;
    let length_match = text[j].correct_length;
    
    let row = table.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    cell1.innerHTML = correct;
    cell2.innerHTML = password_entered;
    cell3.innerHTML = num_correct_letters;
    cell4.innerHTML = length_match;
  }
}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}