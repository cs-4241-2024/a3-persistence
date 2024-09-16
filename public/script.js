let toggle = () => {

  let element = document.getElementById("BESTbutton");
  let hidden = element.getAttribute("hidden");

  if (hidden) {
    element.removeAttribute("hidden");
  } else {
    element.setAttribute("hidden", "hidden");
  }
}
//let collection;


const updateTable = function () {
  const table = document.getElementById("myTable");
  table.innerHTML = "<tr> <th> Your new number</th><th>Your wanted calculation</th><th>GRAND TOTAL(Starts at 0) </th></tr>"
  let total = 0;
  let babyUser = document.getElementById("Username");
  fetch('/data?' + new URLSearchParams({
    //change this to be current user
    name: "Bob",
  }).toString())
    .then(response => response.json())
    .then(data => {
      //console.log(json);
      //i have a sort functoin!!
      //let data = JSON.parse(json)
      //console.log(data);
      data.sort((a, b) => a.timestamp - b.timestamp);
      for (entry of data) {
        table.innerHTML += "<tr> <td>" + entry.number + "</td> <td>" + entry.operation + "</td> <td>" + Number(entry.total) + "</td> </tr>";
        total = Number(entry.number) + total
        //console.log(entry);
      }
      //console.log(data);
    });

  /*if (jsonData !== null) {
    //console.log("inside the update");
    jsonData.forEach(entry => {
      table.innerHTML += "<tr> <td>" + entry.firstnum + "</td> <td>" + entry.lastnum + "</td> <td>" + entry.total + "</td> </tr>";
      //console.log("inside the ENTRY update");
    });
  }*/
}

async function submit() {
  const postdata = {
    "number": document.getElementById("number").value,
    "operation": document.getElementById("operation").value,
    "name": document.getElementById("Username").value,
    //"personInfo": 
  }
  //console.log(postdata);
  if (postdata.operation == "Add" || postdata.operation == "Sub" ||
    postdata.operation == "Div" || postdata.operation == "Mult") {
    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postdata)
    })
      .then(response => response.json())
      .then(json => console.log(json));
    //.then(json => { updateTable(json) })
    window.location.reload();
  }
  else {
    alert("Inncorrect calculation identifier. Please retype.")
  }

};

async function enter() {
  let name = { 'name': document.getElementById("Username").value };
  console.log(name);
  fetch('/enter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(name)
  })
    //.then(response => response.json())
    //.then(json => console.log(json));
}



async function kill() {
  fetch('/kill', {
    method: 'POST'
  })
    .then(response => response.json())
    .then(json => console.log(json));
}//then(json => { updateTable(json) })



window.onload = function () {
  updateTable();
  //.then(json => { updateTable(json) })
}