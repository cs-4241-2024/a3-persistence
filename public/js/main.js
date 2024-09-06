// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();

    const nameInput = document.querySelector("#itemName"),
        quantityInput = document.querySelector("#itemQuantity"),
        priceInput = document.querySelector("#itemPrice"),
        json = {
            name: nameInput.value,
            quantity: Number(quantityInput.value),
            price: Number(priceInput.value),
        },
        body = JSON.stringify(json);

    // Validating input
    if (json.name == null || json.name == "") {
        alert("Item name cannot be empty");
        return;
    }
    if (json.price == null || json.price == 0 || isNaN(json.price)) {
        alert("Price must be a positive decimal number");
        return;
    }
    if (json.quantity == null || json.quantity == 0 || isNaN(json.quantity)) {
        alert("Quantity must be a positive number");
        return;
    }

    const response = await fetch("/submit", {
        method: "POST",
        body,
    });
    const text = await response.text();

    // Add a new row to the table
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = json.name;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = json.price;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = json.quantity;
    tr.appendChild(td);
    td = document.createElement("td");
    td.innerHTML = json.price * json.quantity;
    tr.appendChild(td);
    document.querySelector("#list").appendChild(tr);

    // Clearing the form
    nameInput.value = "";
    quantityInput.value = "";
};

window.onload = async function () {
    const button = document.querySelector("button");
    button.onclick = submit;

    // Loading icon
    let loading = document.createElement("div");
    loading.innerHTML = "loading...";

    document.querySelector("#list").appendChild(loading);
    const response = await fetch("/data", {
        method: "GET",
    });
    const data = await response.json();
    document.querySelector("#list").removeChild(loading);

    // Displaying data
    for (const item of data) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = item.name;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = item.price;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = item.quantity;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = item.price * item.quantity;
        tr.appendChild(td);
        document.querySelector("#list").appendChild(tr);
    }
};
