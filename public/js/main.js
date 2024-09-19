// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#yourname' )
  const json = { 'str' : input.value }
  const body = JSON.stringify( json )
  
  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body : body
  })

  const text = await response.text()

  console.log( 'text:', text )
  updateFriends()
}

// Function to send edit request to server
const edit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const edit_value = document.querySelector( '#edit-list' ).value
  const name = document.querySelector( '#name-to-edit' ).value
  const new_value = document.querySelector( '#new-value' ).value
  const json = {'edit' : edit_value, 'name' : name, 'new_value' : new_value}
  const body = JSON.stringify( json )
  
  const response = await fetch( '/edit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body : body
  })

  const text = await response.text()

  console.log( 'text:', text )
  updateFriends()
}

const login = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const username = document.querySelector( '#username' )
  const password = document.querySelector('#password')
  const json = { 'username' : username.value , 'password' : password.value}
  const body = JSON.stringify( json )
  
  const response = await fetch( '/login', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body : body
  })

  const text = await response.text()

  console.log( 'text:', text )
  if (response.status != 200){
    console.log('Invalid username or password')
  }
  else{
    window.location.href = 'tracker.html'
  }
  
}

const signup = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const username = document.querySelector( '#signup-username' )
  const password = document.querySelector('#signup-password')
  const json = { 'username' : username.value , 'password' : password.value}
  const body = JSON.stringify( json )
  
  const response = await fetch( '/signup', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body : body
  })

  const text = await response.text()

  console.log( 'text:', text )
  if (response.status != 200){
    console.log('Error signing up')
  }
  else{
    console.log('Successful signup')
    window.location.href = 'index.html'
  }
  
}


const delete_name = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#editname' )
  const json = { 'str' : input.value }
  const body = JSON.stringify( json )
  
  const response = await fetch( '/delete', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body : body
  })

  const text = await response.text()

  console.log( 'text:', text )
  updateFriends()
}

function updateFriends(){
  fetch('/data').then(response => response.json()).then(data => {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';
    const headrow = document.createElement('tr');
    
    const headname = document.createElement('td');
    headname.className = "top-row";
    headname.textContent = 'Name';
    headrow.appendChild(headname);

    const heademail = document.createElement('td');
    heademail.className = "top-row";
    heademail.textContent = 'Email';
    headrow.appendChild(heademail);

    const headphone = document.createElement('td');
    headphone.className = "top-row";
    headphone.textContent = 'Phone';
    headrow.appendChild(headphone);

    const headgrade = document.createElement('td');
    headgrade.className = "top-row";
    headgrade.textContent = 'Grade';
    headrow.appendChild(headgrade);

    friendList.appendChild(headrow)

    data.forEach(s => {
      const trow = document.createElement('tr');

      const tname = document.createElement('td');
      tname.className = "h-row";
      tname.textContent = s.name;
      trow.appendChild(tname);
  
      const temail = document.createElement('td');
      temail.className = "h-row";
      temail.textContent = s.email;
      trow.appendChild(temail)

      const tnumber = document.createElement('td');
      tnumber.className = "h-row"
      tnumber.textContent = s.phone;
      trow.appendChild(tnumber)

      const tgrade = document.createElement('td');
      tgrade.className = "h-row"
      tgrade.textContent = s.grade;
      trow.appendChild(tgrade)
    
      friendList.appendChild(trow)
    })
  })
}

window.onload = function() {
  // Update list of window is on that page
  if (window.location.pathname.endsWith('tracker.html')){
    updateFriends()
  }
  
  const submitButton = document.querySelector('#add-button')
  const deleteButton = document.querySelector('#delete-button')
  const loginButton = document.querySelector('#signin')
  const logoutButton = document.querySelector('#logout-button')
  const signupButton = document.querySelector('#signup-button')
  const signup_submitButton = document.querySelector('#submit-signup')
  const editButton = document.querySelector('#edit-button')
  if (submitButton){
    submitButton.onclick = submit;
  }
  if (editButton){
    editButton.onclick = edit;
  }
  if (signup_submitButton){
    signup_submitButton.onclick = signup;
  }
  if (logoutButton){
    logoutButton.onclick = function () {
      window.location.href = 'index.html';
    }
  }
  if (signupButton){
    signupButton.onclick = function () {
      window.location.href = 'signup.html';
    }
  }
  if (deleteButton) {
    deleteButton.onclick = delete_name;
  }
  if (loginButton) {
    loginButton.onclick = login;
  }
}
