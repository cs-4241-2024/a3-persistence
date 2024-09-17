const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const input = document.querySelector( '#title'); //,,"","","#ranking" 
    const input2 = document.querySelector('#author');
    const input3 = document.querySelector('#year');
    const input4 = document.querySelector('#genre');
    const input5 = document.querySelector('#ranking'),
          json = { "title": input.value,"author":input2.value,"year":Number(input3.value),"genre":input4.value,"ranking":Number(input5.value)},
          body = JSON.stringify( json )
  
    const response = await fetch( '/add', {
      method:'POST', //POST is 
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    if (response.status==200) {//making a message show up to the user to see successfully added or deleted
      displayer();

    } else if (response.status==400) { //error for you can't add it to the dataset but whatever i do not know how to tell the user that
      throw new Error(`HTTP error! Status: Book already exsists in the Manager. Add a different book`);
      //I will update the status or a pop up thing with ID so it won't add to it since it's incorrect
    }
  
    const text = await response.json()
    console.log( 'text:', text)
  }


  const deleter = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const input = document.querySelector( '#delTitle');
          json = { "title": input.value},
          body = JSON.stringify( json )
  
    const response = await fetch( '/remove', {
      method:'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    if (response.status==200) {//making a message show up to the user to see successfully added or deleted
      displayer();

    } else if (response.status==400) {//error for you can't delete it to the dataset but whatever i do not know how to tell the user that
      throw new Error(`HTTP error! Status: Book can't be deleted because it is not in the table`);
      //I will update the status or a pop up thing with ID so it won't add to it since it's incorrect
    }
  
    const text = await response.json()  
    console.log( 'text:', text)
  }

  const displayer = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    //event.preventDefault()

    const input = "display",
          json = {"task":input},
          body = JSON.stringify( json )
  
    const response = await fetch( '/displayer', {
      method:'GET'
    })
    if (response.status==200) {//request successful

    } else if (response.status==400) {
      //no data to display
    }
    const text = await response.json()

    
    //element.innerHTML = `<a href="http://wpi.edu"> ${text[2].title} </a>`
    while (tableBody.rows.length > 0) {
      tableBody.deleteRow(0);//clearing the table rows to rewrite
    }
    for (let i=0;i<text.length;i++) {
      // Create a new row
      let row = document.createElement('tr');

      for (const key in text[i]) {
        if (key!=="_id") {
        let cell = document.createElement('td');
        cell.textContent = text[i][key]; // Set the content of the cell
        row.appendChild(cell);
      }
      }
      tableBody.appendChild(row);
    }
      
      

  
    console.log('text:',"display clicked");

  }

  const change = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const input = document.querySelector( '#row');
    const input2 = document.querySelector( '#col');
    const input3 = document.querySelector( '#newVal');
    const input4 = "change",
          json = { "row": Number(input.value),"col":Number(input2.value), "newVal":input3.value},
          body = JSON.stringify( json )
  
    const response = await fetch( '/update', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body
    })
    if (response.status==200) {//request successful
      displayer();
      

    } else if (response.status==400) {
      //no change
      throw new Error(`HTTP error! Status: Could not change Entry in the Table`);
    }
    const text = await response.json()
    console.log( 'text:', text)
  }
  
  window.onload = function() {//learned if there is an uncaught error in this then the rest won't be run
    const newBookButton = document.querySelector("#newBook");
    newBookButton.onclick = submit;
    const deleteBookButton = document.querySelector("#deleteBook");
    deleteBookButton.onclick = deleter;
    const changingButton = document.querySelector("#changing");
    changingButton.onclick = change;
    //call the function
    displayer();
    console.log("ran this above");

    

    const tableBody = document.getElementById('tableBody');
    
  }