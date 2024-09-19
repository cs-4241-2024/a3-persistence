// FRONT-END (CLIENT) JAVASCRIPT HERE

const useSpell = async function( event ) {
  event.preventDefault()

  let json = { "command": "useSpell", "payload": event.target.value}
  body = JSON.stringify(json)

  let response = await fetch( '/useSpell', {
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body 
  })

  let resp = await response.text()
  console.log("Cast a spell with a slot of level " + JSON.parse(resp).lvl)

  loadTable()

}

const regainSpell = async function( event ) {
  event.preventDefault()

  let json = { "command": "regainSpell", "payload": event.target.value}
  body = JSON.stringify(json)

  let response = await fetch( '/regainSpell', {
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body 
  })

  let resp = await response.text()
  console.log("Regained a spell slot of level " + JSON.parse(resp).lvl)

  loadTable()
}

const addMinusButton = function(tr, i) {

  let td = tr.appendChild(document.createElement("td"))
  let mbutton = document.createElement("button")
  mbutton.appendChild(document.createTextNode("Use"))
  mbutton.setAttribute("value", i)
  mbutton.setAttribute("type", "button")
  mbutton.addEventListener("click", useSpell)
  td.appendChild(mbutton)
}

const addPlusButton = function(tr, i) {

  let td = tr.appendChild(document.createElement("td"))
  let pbutton = document.createElement("button")
  pbutton.appendChild(document.createTextNode("Regain"))
  pbutton.setAttribute("value", i)
  pbutton.setAttribute("type", "button")
  pbutton.addEventListener("click", regainSpell)
  td.appendChild(pbutton)
}

const loadTable = async function() {
  // loads the table
  // will be called on loading the page and changing a value
  const table = document.getElementById("table")

  while (table.firstChild) {
    table.removeChild(table.lastChild)
  }
  
  for (let i = 0; i < 11; i++) {
    let tr = table.appendChild(document.createElement("tr"))
    // for each level of spell,
    // create a row of data
    // that corresponds to it.
    let json = { "command": "loadtable", "payload": i}
    //body = JSON.stringify(json)
    //console.log(body)


    let response = await fetch( '/loadTable', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(json),
    })
    
    let resp = await response.text()
    let tabledata = JSON.parse(resp)
    console.log(tabledata)

    if (i === 1 || i === 0) {
      for (let key in tabledata) {
        // add data to the table based on key
        let th = tr.appendChild(document.createElement("th"))
        th.appendChild(document.createTextNode(tabledata[key]))
      }
    } else {
      for (let key in tabledata) {
        // add data to the table based on key
        let td = tr.appendChild(document.createElement("td"))
        td.appendChild(document.createTextNode(tabledata[key]))
      }
      addPlusButton(tr, i)
      addMinusButton(tr, i)
    }


  }
}

const lrest = async function( event ) {
  event.preventDefault()

  let json = { "command": "longrest", "payload": 0}
  body = JSON.stringify(json)

  let response = await fetch( '/longRest', {
  method:'POST',
  body 
  })

  let resp = await response.text()
  console.log("Long rested at level " + JSON.parse(resp).lvl)

  loadTable()
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#wizlvl' ),
        json = {command: "levelchange", payload: parseInt(input.value)},
        body = JSON.stringify( json )

  const response = await fetch( '/submit', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body 
  })

  let resp = await response.text()
  
  console.log("Levelled up to level " + JSON.parse(resp).lvl)

  loadTable()
}

window.onload = function() {
 loadTable();
 const lvlbutton = document.getElementById("lvlb");
 lvlbutton.onclick = submit;
 const lrbutton = document.getElementById("lrest");
 lrbutton.onclick = lrest;
}