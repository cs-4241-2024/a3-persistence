/**
 * Formats a log message to include message source.
 * 
 * @param {string} src Message source.
 * @param {string} message Base log message.
 * @returns Formatted log message.
 */
function formatLog(src, message)
{
  return `[${src.toUpperCase()}] → ${message}`;
}

/**
 * Translates table header ids to text to use as titles.
 * 
 * @param {string} id Table header id.
 * @returns Interpreted table header.
 */
function translateHeaderID(id)
{
  switch (id)
  {
  case "id":
    return "Laptop ID";
  
  case "firstname":
    return "First Name";
  
  case "lastname":
    return "Last Name";

  case "dup":
    return "Duplicate Client?"

  default:
    return "Unknown";
  }
}

/**
 * Handler for user input submission.
 * 
 * @param {*} event Event object.
 */
async function submit(event)
{
  // Prevent browser from loading a new page
  event.preventDefault();
  
  // Get data from form
  const lt_id        = document.querySelector("#id");
  const lt_firstname = document.querySelector("#firstname");
  const lt_lastname  = document.querySelector("#lastname");

  // Convert data to JSON
  const json = {id: lt_id.value, firstname: lt_firstname.value, lastname: lt_lastname.value};
  const body = JSON.stringify(json);
  
  // Send POST request
  const response = await fetch("/submit", {method:"POST", headers: {"Content-Type": "application/json"}, body});
  const text     = await response.text();

  if (response.ok)
  {
    // Refresh table if OK
    refreshTable();
  }
  else
  {
    // Alert window if error
    window.alert(`ERROR: ${text}`);
  }

  // DEBUG: Log user input
  // console.log(formatLog("SUBMIT", `User input: ${text}`));
}

/**
 * To trigger on a button click, removes the corresponding table.
 * 
 * @param {*} btn Button object.
 */
async function removeRow(btn)
{ 
  // Get corresponding laptop ID
  let button = document.querySelector(`#${btn.currentTarget.id}`);
  let row = button.parentNode.parentNode;
  let laptopID = parseInt(row.cells[0].innerText);
  
  // Convert to JSON
  let json = {id: laptopID};
  let body = JSON.stringify(json);

  // Send POST request
  let response = await fetch("/remove", {method:"POST", headers: {"Content-Type": "application/json"}, body});

  if (response.ok)
  {
    // Refresh table if OK
    refreshTable();
  }
}

/**
 * Attempts to log in user with given username and password.
 * @param {*} event 
 */
async function logout(event)
{
  // Prevent browser from loading a new page
  // event.preventDefault();
  
  // Send POST request
  const response = await fetch("/logout", {method:"POST"});
  const text     = await response.text();

  if (response.ok)
  {
    // document.querySelector("#login-msg").innerText = `Login success!`;
    document.open();
    document.write(text);
    document.close();
  }
  else
  {
    // document.querySelector("#login-msg").innerText = `Login failed!`;

    // Alert window if error
    // window.alert(`ERROR: ${text}`);
  }
}

/**
 * Refresh active loan table (replace with version most up-to-date with server).
 */
async function refreshTable()
{
  // Reference: https://www.geeksforgeeks.org/javascript-fetch-method/
  let tableData;

  // Get data from server
  await fetch("/table").then(response => response.json()).then(data =>
    {
      tableData = data;
    }
  );

  // Reference: https://stackoverflow.com/questions/27594957/how-to-create-a-table-using-a-loop
  let newTable = document.createElement("table");
  let tr, th, td, row, col, btn;

  // Get row and column count of table
  let rowCount = tableData.length - 1;
  let colCount = (rowCount > 0) ? (Object.keys(tableData[0]).length + 1) : 5;

  newTable.id = "laptops";
  
  // Rebuild headers
  tr = document.createElement("tr");
  for (col = 0; col < colCount; col++)
  {
    th = document.createElement("th");
    switch (col)
    {
      case 0:
        th.textContent = translateHeaderID("id");
        break;

      case 1:
        th.textContent = translateHeaderID("firstname");
        break;

      case 2:
        th.textContent = translateHeaderID("lastname");
        break;

      case 3:
        th.textContent = translateHeaderID("dup");
        break;

      case 4:
        th.className = "removecol";
        break;

      default:
        th.textContent = "This Column Should Not Exist ¯\\_(ツ)_/¯";
        break;
    }

    tr.appendChild(th);
  }

  newTable.appendChild(tr);

  // Build new data rows
  for (row = 0; row <= rowCount; row++)
  {
    tr = document.createElement("tr");
    for (col = 0; col < colCount; col++)
    {
      td = document.createElement("td");
      
      switch(col)
      {
      case 0:
        td.textContent = tableData[row].id;
        break;

      case 1:
        td.textContent = tableData[row].firstname;
        break;

      case 2:
        td.textContent = tableData[row].lastname;
        break;

      case 3:
        td.textContent = (tableData[row].dup === true) ? "Yes" : "No";
        break;

      // Add remove button to each row
      case 4:
        btn = document.createElement("button");
        btn.id = `removebtn-${row}`;
        btn.textContent = "Remove";
        btn.className = "removebtn";
        btn.onclick = removeRow;
        td.className = "removecol";
        td.appendChild(btn);
        break;

      default:
        td.textContent = "No such attribute.";
        break;
      }

      tr.appendChild(td);
    }
    newTable.appendChild(tr);
  }

  // Replace existing table
  document.querySelector("#laptops").replaceWith(newTable);
}

/**
 * Set button click action to submit function.
 */
window.onload = function()
{
  // Set submit function
  const button = document.getElementById("submitbtn");
  button.onclick = submit;
  
  // Set refresh function
  const refreshBtn = document.getElementById("rfrsh");
  refreshBtn.onclick = refreshTable;

  // Set log out function
  const logoutButton = document.getElementById("logout");
  logoutButton.onclick = logout;

  // Init table
  refreshTable();

  // console.log("LOADED MAIN.JS");
}