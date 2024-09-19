// FRONT-END (CLIENT) JAVASCRIPT HERE

let creds = {username : "", shortname: ""};
let scores = {};

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  if (creds.shortname !== ""){
    const
        dateinput = document.querySelector("#thedate"),
        pointinput = document.querySelector("#points"),
        json = { name: creds.shortname, date: dateinput.value, points: pointinput.value},
        body = JSON.stringify(json)

    const response = await fetch( 'http://localhost:3000/score/add', {
      headers: {"Content-Type": "application/json" },
      method:'POST',
      body: body
    })

    const text = await response.text()
    updateTable();
  }
  else {
    alert("Please log in before submitting scores.")
  }
}
const getAll = async function (){
  const json = { shortname: creds.shortname},
      body = JSON.stringify(json)

  const response = await fetch( 'http://localhost:3000/score/getall',{
    headers: {"Content-Type": "application/json" },
    method:'POST',
    body: body
  })
  let text = await response.json()
  return text;

}
const updateTable = function () {
  if (creds.shortname !== "") {
    getAll().then(res => {
      scores = res;
      const leaderdata = document.querySelector("#leaderdata");
      leaderdata.innerHTML = ""
      let html = "";
      scores = scores.sort(function (a, b) {
        let pointa = parseInt(a.points)
        let pointb = parseInt(b.points)
        if (pointa > pointb) return -1;
        else if (pointa == pointb) {
          if (a.date < b.date) return -1;
          else return 1;
        } else return 1;
      })
      for (let i = 1; i <= scores.length; i++) {
        scores[i - 1] = {...scores[i - 1], rank: i}
      }


      for (let i = 0; i < scores.length; i++) {
        html += "<tr>";
        html += "<td>" + scores[i].name + "</td>";
        html += "<td><input type='date' id='date" + i + "' value='" + scores[i].date + "' class='bg-blue-800 border-blue-950 border-2 text-center'></input></td>";
        html += "<td><input type='number' id='point" + i + "' value='" + scores[i].points + "' class='bg-blue-800 border-blue-950 border-2 text-center'></input></td>";
        html += "<td>" + scores[i].rank + "</td>";
        html += "<td><button onclick='editScore(" + i + ")' class='bg-blue-800 border-blue-950 border-2 text-center'>save</button><button onclick='deleteTable(" + i + ")' class='bg-blue-800 border-blue-950 border-2 text-center'>delete</button></td></tr>";
      }
      const leader = document.querySelector("#leader");
      leader.setAttribute("visibility", "visible");
      leaderdata.innerHTML = html

    })
  } else {
    alert("Please log in to view scores.")
  }
}

const registerAccount = async function( event ){
  const shortname = document.querySelector( "#shortname"),
      username = document.querySelector("#username"),
      password = document.querySelector("#password"),
      json = { shortname: shortname.value, username: username.value, password : password.value},
      body = JSON.stringify(json)
  const response = await fetch( 'http://localhost:3000/user/register', {
    headers: {"Content-Type": "application/json" },
    method:'POST',
    body: body
  })
  const text = await response.text()
  if (response.status === 400) {
    alert("Username already in use")
  } else if (response.status === 200){
    alert("Registered. Now login")
  }
}
const logindata = async function( event ){
  const       username = document.querySelector("#username"),
      password = document.querySelector("#password"),
      json = { username: username.value, password : password.value},
      body = JSON.stringify(json)
  const response = await fetch( 'http://localhost:3000/user/login', {
    headers: {"Content-Type": "application/json" },
    method:'POST',
    body: body
  })
  if (response.status === 200) {
    alert("Log in successful")
    let text = await response.json();
    return {username : text.username, shortname: text.shortname}
    //HIDE THE LOGIN FORM, AUTO SET NAME, ADD LOGOUT

  } else if (response.status === 400){
    alert("Credentials do not match any in our records. Please try again")
  }
}
const login = function (){
  logindata().then(res => {
    creds = res;
    document.getElementById('shortname').value = creds.shortname;
    updateTable();
  })
}
const deleteTable = async function (ind){
  if (scores.length !== 0) {
    const response = await fetch('http://localhost:3000/score/delete/' + scores[ind]._id, {
      headers: {"Content-Type": "application/json"},
      method: 'DELETE',
    })
  }
  updateTable();
}

const editScore = async function( ind){
  const point = document.querySelector("#point" + ind),
      date = document.querySelector("#date" + ind );
  let data =  scores[ind];
  data.points = point.value;
  data.date = date.value;
  const json = {data : data},
      body = JSON.stringify(json)

  const response = await fetch('http://localhost:3000/score/update/', {
    headers: {"Content-Type": "application/json"},
    method: 'POST',
    body: body
  })
  const text = await response.text();
}
window.onload = function() {
   const submitButton = document.querySelector("#submitbutton");
  submitButton.onclick = submit;


  const registerButton = document.querySelector("#register");
  registerButton.onclick = registerAccount;
  const loginButton = document.querySelector("#login");
  loginButton.onclick = login

  const deleteTableButton = document.querySelector("#delete");
  deleteTableButton.onclick = deleteTable;
  const editTableButton = document.querySelector("#edit");
  editTableButton.onclick = editScore;
}
