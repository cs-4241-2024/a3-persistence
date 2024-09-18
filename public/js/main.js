let loggedIn = false;
let lastRow = {};
let username = null;
let password = null;
const showData = function (data) {
	//TODO: Make it so null data cannot be displayed (like the log in entry)
	const dataTable = document.querySelector('#dataTable');
	let innerHTMLString = `
  <tr>
    <th>Class Code</th>
    <th>Class Name</th>
    <th>Assignment</th>
    <th>Days Left</th>
    <th>Due Date</th>
  </tr>`;
	// console.log("Data: ", data);
	// lastRow = data[data.length - 1];
	// console.log("Last Row" + lastRow);
	data.forEach(element => {
		// const tableRow
		innerHTMLString += `<tr>
    <td>${element.classCode}</td>
    <td>${element.className}</td>
    <td>${element.assignment}</td>
    <td>${element.daysLeft}</td>
    <td>${element.dueDate}</td>
  </tr>`;

		//Not optimal
		lastRow = {
			"classCode": element.classCode,
			"className": element.className,
			"assignment": element.assignment,
			"daysLeft": element.daysLeft,
			"dueDate": element.date
		};

	});
	dataTable.innerHTML = innerHTMLString;
}

//Getting data for the table
const getData = async function (event) {
	if (loggedIn) {
		const response = await fetch('/data', {
			method: 'GET',
			headers: { "Content-Type": "application/json" },
		});
		const json = await response.json();
		showData(json);
	}
}

const submit = async function (event) {
	if (loggedIn) {
		event.preventDefault();

		const classCode = document.querySelector('#Code').value;
		const className = document.querySelector('#Name').value;
		const assignment = document.querySelector('#Assignment').value;
		const daysLeft = document.querySelector('#Days').value;

		let daysToAdd = parseInt(daysLeft);
		if (isNaN(daysLeft)) {
			//Is not a number
			daysToAdd = 0;
		}
		if (daysToAdd === null) {
			daysToAdd = 0;
		}
		let date = new Date();
		date.setDate(date.getDate() + daysToAdd);

		const newData = {
			"classCode": classCode,
			"className": className,
			"assignment": assignment,
			"daysLeft": daysLeft,
			"dueDate": date
		};

		//Sumbitting a new to-do item
		const response = await fetch('/submit', {
			method: 'POST',
			body: JSON.stringify(newData),
			headers: { "Content-Type": "application/json" },
		});

		const text = await response.text();

		console.log('text:', text);
		console.log("data:", newData);
		getData();
	}
}

const deleteRow = async function (event) {
	if (loggedIn) {
		const response = await fetch('/delete', {
			method: 'POST',
			body: JSON.stringify(lastRow),
			headers: { "Content-Type": "application/json" },
		});
		const json = await response.json();
		getData(json);
	}
}

const logIn = async function (event) {
	if (!loggedIn) {
		event.preventDefault();

		username = document.querySelector('#Username').value;
		password = document.querySelector('#Password').value;

		const newData = {
			"Username": username,
			"Password": password
		};
		const response = await fetch('/logIn', {
			method: 'POST',
			body: JSON.stringify(newData),
			headers: { "Content-Type": "application/json" },
		});
		const json = await response.json();
		console.log(json);
		console.log("Username " + json.Username);
		console.log("Password " + json.Password);
		if (json.Username != username || json.Password != password) {
			//Making the call again incase during the last call a new user was made
			const response2 = await fetch('/logIn', {
				method: 'POST',
				body: JSON.stringify(newData),
				headers: { "Content-Type": "application/json" },
			});
			const json2 = await response2.json();
			if (json2.Username != username || json2.Password != password) {
				alert("Your password is incorrect!");
			}
			else {
				loggedIn = true;
				getData();
			}
		}
		else {
			loggedIn = true;
			getData();
		}
	}
}

window.onload = function () {
	loggedIn = false;
	document.querySelector('#submitButton').onclick = submit;
	document.querySelector('#deleteButton').onclick = deleteRow;
	document.querySelector('#logInButton').onclick = logIn;
	getData();
}