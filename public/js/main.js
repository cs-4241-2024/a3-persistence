// FRONT-END (CLIENT) JAVASCRIPT HERE

const submitPlayer = async function( ev ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  ev.preventDefault()

  // make new record and populate with data from form
  let newRecord = {}
  newRecord['rDyn'] = parseInt(document.getElementById("rDyn").value)
  newRecord['rPPR'] = parseInt(document.getElementById("rPPR").value)
  newRecord['name'] = document.getElementById("name").value
  newRecord['team'] = document.getElementById("team").value
  newRecord['pos'] = document.getElementById("pos").value
  newRecord['byeWeek'] = parseInt(document.getElementById("byeWeek").value)
  newRecord['age'] = parseInt(document.getElementById("age").value)

  //send new data
  let message = JSON.stringify( newRecord )

  const response = await fetch( '/submit', {
    method:'POST',
    body: message
  })

  const text = await response.text()

  if(response.ok) {
    await loadTable()
  }

  console.log( 'text:', text )
}

async function deletePlayer(ev) {
  ev.preventDefault()
  //send id to delete
  let idToDelete = {id: document.getElementById("id").value}
  let message = JSON.stringify(idToDelete)

  const response = await fetch('/delete', {
    method: 'POST',
    body: message
  })

  const text = await response.text()

  if (response.ok) {
    await loadTable()
  }

  console.log('text:', text)
}
async function loadTable() {

  let FFtableBody = document.getElementById("FFtable")
  //delete any only entries
  while (FFtableBody.children.length >0){
    FFtableBody.removeChild(FFtableBody.lastChild)
  }

  // fetch table data from backend
  const response = await fetch('/FFtable', {
    method: 'GET'
  })
  let FFdata = JSON.parse(await response.text())
  // create new rows in table based on data
  for (let i =0; i<FFdata.length;i++) {
    let newTableRow = document.createElement("tr")
    createCell(newTableRow,FFdata[i]["id"])
    createCell(newTableRow,FFdata[i]["rDyn"])
    createCell(newTableRow,FFdata[i]["rPPR"])
    createCell(newTableRow,FFdata[i]["rDelta"])
    createCell(newTableRow,FFdata[i]["name"])
    createCell(newTableRow,FFdata[i]["team"])
    createCell(newTableRow,FFdata[i]["pos"])
    createCell(newTableRow,FFdata[i]["byeWeek"])
    createCell(newTableRow,FFdata[i]["age"])
    //create edit cell
    let editCell = document.createElement("td")
    editCell.textContent = "Edit"
    editCell.className="editCell"
    editCell.addEventListener("click",handleEdit)
    editCell.indexID = i
    newTableRow.append(editCell)
    FFtableBody.append(newTableRow)
  }
}

function createCell(row,content){
  let cell = document.createElement("td")
  cell.textContent = content
  row.append(cell)
}

async function handleEdit(event){
  let editButton = event.target
  let index = event.indexID
  editButton.textContent="Save"
  editButton.removeEventListener("click",handleEdit)
  let currentRow = editButton.parentElement
  //skip last element as thats the save button
  for(let i =1; i<currentRow.children.length-1;i++){
    let cell = currentRow.children[i]
    let input = document.createElement("input")
    input.setAttribute("value",cell.textContent)
    input.setAttribute("type","text")
    input.className = "editInput"
    cell.textContent = ""
    cell.appendChild(input)
  }
  editButton.addEventListener("click",handleSave)
}

async function handleSave(event) {
  let editButton = event.target
  let index = editButton.indexID

  let indexToGet = {index: index.toString()}
  let message = JSON.stringify(indexToGet)

  const response = await fetch('/record', {
    method: 'POST',
    body:message
  })

  if(!response.ok){
    console.error("record id for edit not found")
    return
  }

  let editedRecord = JSON.parse(await response.text())

  let currentRow = editButton.parentElement
  let recordFields = ["rDyn","rPPR","rDelta","name","team","pos","byeWeek","age"]

  let test = currentRow.children[1]
  let inputTest = test.firstElementChild
  let valueTest = inputTest.value

  //skip last element as thats the save button
  for(let i =1; i<currentRow.children.length-1;i++){
    let cell = currentRow.children[i]
    let input = cell.firstElementChild
    let value = input.value

    editedRecord[recordFields[i-1]]=value
    cell.removeChild(input)
    cell.textContent=value
  }


  let editMessage = {index: index.toString(), editedRecord: JSON.stringify(editedRecord)}
  const responseEdit = await fetch('/edit', {
    method: 'POST',
    body: JSON.stringify(editMessage)
  })

  if(responseEdit.ok){
    editButton.removeEventListener("click",handleSave)
    await loadTable()
  }
  else{
    console.error("edit failed")
  }

}

window.onload = function() {
  const button = document.getElementById("EntrySubmit");
  button.onclick = submitPlayer;
  const buttonDelete = document.getElementById("deleteSubmit");
  buttonDelete.onclick = deletePlayer;
  loadTable().then(r => {})
}