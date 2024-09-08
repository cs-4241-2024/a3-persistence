// FRONT-END (CLIENT) JAVASCRIPT HERE

const validateInput = function (json) {
    if (json.name == null || json.name == "") {
        alert("Item name cannot be empty");
        return false;
    }
    if (json.price == null || json.price == 0 || isNaN(json.price)) {
        alert("Price must be a positive decimal number");
        return false;
    }
    if (json.quantity == null || json.quantity == 0 || isNaN(json.quantity)) {
        alert("Quantity must be a positive number");
        return false;
    }

    return true;
};

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
    if (!validateInput(json)) {
        return;
    }

    // Adding the item to the list
    const response = await fetch("/submit", {
        method: "POST",
        body,
    });
    const text = await response.text();

    // Revalidating data
    await revalidate();

    // Clearing the form
    nameInput.value = "";
    priceInput.value = "";
    quantityInput.value = "";
};

window.onload = async function () {
    const button = document.querySelector("#newItemSubmit");
    button.onclick = submit;

    await revalidate();
};

const revalidate = async () => {
    // Building the table layout
    let tr = document.createElement("tr");
    const headers = ["Item", "Price", "Quantity", "Total"];
    headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        tr.appendChild(th);
    });
    document.querySelector("#list").innerHTML = tr.outerHTML;

    // Loading icon
    let loading = document.createElement("div");
    loading.innerHTML = "loading...";

    // Displaying loading icon while revalidating
    document.querySelector("#list").appendChild(loading);
    const response = await fetch("/data", {
        method: "GET",
    });
    const data = await response.json();
    document.querySelector("#list").removeChild(loading);

    // Displaying new data
    let total = 0;
    for (const [i, item] of data.entries()) {
        // Each row
        tr = document.createElement("tr");
        tr.classList.add("record");
        tr.id = `record-${i}`;

        let td = document.createElement("td");
        // Item Name
        td.innerHTML = item.name;
        td.classList.add("recordName");
        tr.appendChild(td);
        // Item Price
        td = document.createElement("td");
        td.innerHTML = item.price;
        td.classList.add("recordPrice");
        tr.appendChild(td);
        // Item Quantity
        td = document.createElement("td");
        td.innerHTML = item.quantity;
        td.classList.add("recordQuantity");
        tr.appendChild(td);
        // Item Total, derived value
        td = document.createElement("td");
        td.innerHTML = item.total;
        td.classList.add("recordTotal");
        tr.appendChild(td);

        // Edit button
        td = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("recordButton");
        editButton.onclick = () => onEdit(i, item);
        td.appendChild(editButton);
        tr.appendChild(td);
        // Delete button
        td = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("recordButton");
        deleteButton.onclick = () => onDelete(i);
        td.appendChild(deleteButton);

        // Adding everything to the row
        tr.appendChild(td);

        document.querySelector("#list").appendChild(tr);

        total += item.total;
    }

    // Displaying grand total
    document.querySelector("#total").innerHTML = total;
};

const onDelete = async function (i) {
    const confirmation = confirm("Are you sure you want to delete this item?");

    if (!confirmation) {
        return;
    }

    const body = JSON.stringify({
        index: i,
    });
    const response = await fetch("/data", {
        method: "DELETE",
        body,
    });

    revalidate();
};

const onEdit = async function (i, item) {
    console.log(JSON.stringify(item));
    const record = document.querySelector(`#record-${i}`);

    // Turning all the cells into inputs individually
    let form = document.createElement("form");
    form.id = "editForm";

    // Item Name
    let td = document.createElement("td");
    const itemNameInput = document.createElement("input");
    itemNameInput.setAttribute("form", "editForm");
    itemNameInput.type = "text";
    itemNameInput.id = "editItemName";
    itemNameInput.placeholder = "item";
    itemNameInput.setAttribute("value", item.name);
    itemNameInput.required = true;
    td.appendChild(itemNameInput);
    form.appendChild(td);
    // Item Price
    td = document.createElement("td");
    const itemPriceInput = document.createElement("input");
    itemPriceInput.setAttribute("form", "editForm");
    itemPriceInput.type = "number";
    itemPriceInput.id = "editItemPrice";
    itemPriceInput.step = "0.25";
    itemPriceInput.placeholder = "price";
    itemPriceInput.setAttribute("value", item.price);
    itemPriceInput.required = true;
    td.appendChild(itemPriceInput);
    form.appendChild(td);
    // Item Quantity
    td = document.createElement("td");
    const itemQuantityInput = document.createElement("input");
    itemQuantityInput.setAttribute("form", "editForm");
    itemQuantityInput.type = "number";
    itemQuantityInput.id = "editItemQuantity";
    itemQuantityInput.placeholder = "#";
    itemQuantityInput.setAttribute("value", item.quantity);
    itemQuantityInput.required = true;
    td.appendChild(itemQuantityInput);
    form.appendChild(td);
    // Submit
    td = document.createElement("td");
    const submitButton = document.createElement("button");
    submitButton.setAttribute("form", "editForm");
    submitButton.textContent = "Update";
    submitButton.setAttribute("type", "submit");
    submitButton.onclick = (e) => onEditSubmit(e, i);
    td.appendChild(submitButton);
    form.appendChild(td);

    form.appendChild(td);

    record.innerHTML = form.outerHTML;
};

const onEditSubmit = async function (e, i) {
    e.preventDefault();

    const form = e.target;
    const itemNameInput = form.querySelector("#itemName");
    const itemPriceInput = form.querySelector("#itemPrice");
    const itemQuantityInput = form.querySelector("#itemQuantity");
    const json = {
        index: i,
        name: itemNameInput.value,
        quantity: Number(itemQuantityInput.value),
        price: Number(itemPriceInput.value),
    };
    const body = JSON.stringify(json);

    console.log("UPDATING UPDATING UPDATING");
    console.log(json);

    validateInput(json);

    const response = await fetch("/data", {
        method: "PUT",
        body,
    });

    revalidate();
};
