// FRONT-END (CLIENT) JAVASCRIPT HERE

const openBookForm = function() {
  document.getElementById("book-form-dialog").showModal();
}

const closeBookForm = function() {
  document.getElementById("book-form-dialog").close();
}

const updateBook = async function(bookId, key, value ) {

  const input = {
    '_id': bookId,
    'key': key,
    'value': value,
  };
  
  body = JSON.stringify( input )

  const response = await fetch( '/update', {
    headers: { 'Content-Type': 'application/json' },
    method:'POST',
    body 
  })

  const serverData = await response.json();
  console.log( 'response:', JSON.stringify(serverData) )
  updateTable();
}

const addBookToTable = function( book, table ) {
  const row = table.insertRow(-1);
  row.setAttribute("id", book["_id"]);

  const title = row.insertCell(0);
  const author = row.insertCell(1);
  const pages = row.insertCell(2);
  const started = row.insertCell(3);
  const finished = row.insertCell(4);
  const avgPages = row.insertCell(5);
  const status = row.insertCell(6);
  const deleteButton = row.insertCell(7);

  title.innerHTML = book["title"];
  author.innerHTML = book["author"];
  pages.innerHTML = book["pages"];
  started.innerHTML = book["started"];
  finished.innerHTML = book["finished"];
  if (book.finished !== "") {
    finishDate = new Date(book.finished);
    finished.innerHTML = finishDate.toLocaleDateString("en-us", {year: "numeric", month: "2-digit", day: "2-digit"});
  }
  avgPages.innerHTML = book["avg-pages"] | "";
  deleteButton.innerHTML = '<button type="image" class="delete-img-wrapper" onclick="deleteBook(this)"><img src="images/delete.svg" alt="Delete Book"></button>';

  // Generate picker to modify status or set to "Read" if already read
  if (book.status === "read") {
    status.innerHTML = "Read";
  } else {
    let picker = document.createElement("select");
    picker.setAttribute("class", "status-picker");
    picker.addEventListener("change", function( event ) {
      console.log("Updated " + book["_id"] + " to " + event.target.value);
      updateBook(book["_id"], "status", event.target.value);
    });
  
    let option1 = document.createElement("option");
    option1.value = 'read'
    option1.innerHTML = 'Read'

    let option2 = document.createElement("option");
    option2.value = 'reading'
    option2.innerHTML = 'Reading'

    let option3 = document.createElement("option");
    option3.value = 'not-read'
    option3.innerHTML = 'Not Read'

    // Append options to picker based on current status (don't allow user to go backwards)
    switch (book.status) {
      case "not-read":
        picker.appendChild(option3);
      case "reading":
        picker.appendChild(option2);
      default:
        picker.appendChild(option1);
    }

    picker.value = book.status;
    status.appendChild(picker); // Append picker to cell
  }

}

const updateTable = async function() {
  const books = await fetch( '/get', {
    method:'GET'
  })
  .then((data) => data.json())
  .catch((error) => console.error(error));


  const table = document.getElementById("book-table");
  const newtbody = document.createElement("tbody");
  
  let booksRead = 0;
  let pagesRead = 0;
  for (let book of books) {
    addBookToTable(book, newtbody);
    if (book.status === "read") {
      booksRead++;
      pagesRead += Number(book.pages);
    }
  }
  table.children[1].replaceWith(newtbody);
  document.getElementById("books-read").innerHTML = booksRead > 12 ? 12 : booksRead;
  document.getElementById("pages-read").innerHTML = pagesRead.toString();
  document.getElementById("status-bar").value = booksRead > 12 ? 12 : booksRead;

}

const deleteBook = async function( event ) {
  const bookId = event.parentElement.parentElement.id;
  const body = JSON.stringify({_id: bookId});

  // ?book-id=${bookId}
  const response = await fetch( `/remove`, {
    headers: { 'Content-Type': 'application/json' },
    method:'POST',
    body
  })

  const serverData = await response.json();
  console.log( 'response:', JSON.stringify(serverData) )
  updateTable();
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  closeBookForm();
  const formData = new FormData(event.target);

  const input = {
    'title': formData.get('title'), 
    'author': formData.get('author'), 
    "pages": formData.get('pages'), 
    "started": formData.get('started'), 
    "finished": formData.get('finished'), 
    "status": formData.get('status')
  };
  
  body = JSON.stringify( input )

  const response = await fetch( '/submit', {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body 
  })

  const serverData = await response.json();
  // console.log( 'response:', JSON.stringify(serverData) )

  updateTable();
}

// document.getElementById("new-book-form").addEventListener("submit", submit);

window.onload = function() {
  document.getElementById("new-book-form").addEventListener("submit", submit);
  document.getElementById("add-book").addEventListener("click", openBookForm);
  updateTable([])
}