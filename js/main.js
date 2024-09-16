// FRONT-END (CLIENT) JAVASCRIPT HERE
let isEdit = -1;
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( '#item'),
  input2 = document.querySelector( '#description'),
  input3 = document.querySelector( '#cost'), input4 = document.querySelector('#tax'),
        json = { item: input.value, description: input2.value, cost: input3.value, tax: input4.value, total: 0, tag: isEdit },
        body = JSON.stringify( json )
 //console.log(input)
  const response = await fetch( '/data', {
    method:'POST',
    body
  })
  let data = await response.json();
  updateTable(data);
  input.value = '';
  input2.value = '';
  input3.value = '';
  input4.value = '';
  isEdit = -1;
        
}

/*async function deleteItem(tag) {
  console.log('Text: ',tag);
  const response = await fetch('/data', {
    method: 'DELETE',
    body: JSON.stringify({tag}),
  });
  const data = await response.json();
  //console.log('Text:', data.tag.value);
  const table = document.getElementById("list");
  table.innerHTML = "";
  table.innerHTML = `<tr><th>Item</th><th>Description</th><th>Cost</th><th>Tax</th><th>Total</th><th>Delete</th><th>Edit</th></tr>`;
  
  data.forEach(item => {
    table.innerHTML += `<tr><td>${item.item}</td><td>${item.description}</td><td>${item.cost}</td><td>${item.tax}</td><td>${item.total}</td><td><button id = "delete${item.tag}" onclick="deleteItem(${item.tag})">Delete</button id = "edit${item.tag}"></td><td><button onclick="editItem(${item.tag})">Edit</button></td></tr>`;
  });
  
}*/

async function deleteItem(evt) {
  let tag = evt.target.id;
  const response = await fetch('/data', {
    method: 'DELETE',
    body: JSON.stringify({tag}),
  });
  let data = await response.json();
  updateTable(data);
}

function updateTable(data) {

  const table = document.getElementById("list");

  table.innerHTML = `<tr><th>Item</th><th>Description</th><th>Cost</th><th>Tax</th><th>Total</th><th>Edit</th><th>Delete</th></tr>`;
  let tbody = document.createElement('tbody');

  data.forEach(item => {
   
   let tr = document.createElement('tr');

   tr.setAttribute('id', item.tag);
   let td1 = document.createElement('td');
   td1.appendChild(document.createTextNode(item.item));
   let td2 =  document.createElement('td');
   td2.appendChild(document.createTextNode(item.description));
  let td3 = document.createElement('td');
  td3.appendChild(document.createTextNode(item.cost));
  let td4 = document.createElement('td');
  td4.appendChild(document.createTextNode(item.tax));
  let td5 = document.createElement('td');
  td5.appendChild(document.createTextNode(item.total));

  let btnEdit = document.createElement('button')
  btnEdit.setAttribute('id',  item.tag);
  btnEdit.textContent = 'Edit';
  btnEdit.addEventListener('click', (evt) => {
      console.log(evt);
      document.getElementById("item").value = item.item;
      document.getElementById("description").value = item.description;
      document.getElementById("cost").value = item.cost;
      document.getElementById("tax").value = item.tax;
      isEdit = item.tag;
      console.log(isEdit);
    });
  let td6 = document.createElement('td')
  td6.appendChild(btnEdit);

  
  let btnDelete = document.createElement('button');
  btnDelete.textContent = 'Delete';
  btnDelete.setAttribute('id', item.tag);
  btnDelete.addEventListener('click', deleteItem);

 let td7 = document.createElement('td');
 td7.appendChild(btnDelete);

    //table.innerHTML += `<tr><td>${item.item}</td><td>${item.description}</td><td>${item.cost}</td><td>${item.tax}</td><td>${item.total}</td><td><button id = "delete${item.tag}" onclick="deleteItem(${item.tag})">Delete</button></td><td>` + document.getElementById(`delete${item.tag}`).addEventListener('click', deleteItem) + `</td></tr>`;
    //document.getElementById(`delete${item.tag}`).addEventListener('click', deleteItem);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tbody.appendChild(tr);

  });
  console.log(tbody)
  table.appendChild(tbody);
  console.log(table);
  //console.log('Text:', data.tag);
}

function editItem(evt){
  
  console.log(evt);
  document.getElementById("item").value = item.item;
  document.getElementById("description").value = item.description;
  document.getElementById("cost").value = item.cost;
  document.getElementById("tax").value = item.tax;
  addEventListener('click', saveItem);
}

async function saveItem(evt) {
  const input = document.querySelector( '#item'),
  input2 = document.querySelector( '#description'),
  input3 = document.querySelector( '#cost'), input4 = document.querySelector('#tax'),
        json = { item: input.value, description: input2.value, cost: input3.value, tax: input4.value, total: 0, tag: 0 },
        body = JSON.stringify( json )
 //console.log(input)
  const response = await fetch( '/data', {
    method:'PUT',
    body
  })
  let data = await response.json();
  updateTable(data);
  input.value = '';
  input2.value = '';
  input3.value = '';
  input4.value = '';
}



window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
}