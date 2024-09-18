// FRONT-END (CLIENT) JAVASCRIPT HERE
window.onload = function() {
    getData()

    const button = document.querySelector("#submit");
    button.onclick = submit;
  
    const button2 = document.querySelector("#delete");
    button2.onclick = deleteRow;
  
    const button3 = document.querySelector("#update");
    button3.onclick = update;
}

const getData = async function () {
    fetch( '/docs' )
    .then( res => res.json() )
    .then( showTable )
}

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const inputType = document.querySelector( '#type' ),
          inputDay = document.querySelector( '#day' ),
          inputRating = document.querySelector( '#rating' ),
          meaning = deriveField(inputRating.value)
          json = { type: inputType.value,
                   day: inputDay.value,
                   rating: inputRating.value,
                   meaning: meaning },
          body = JSON.stringify( json )
    //only add to database if at least one of the text fields isn't blank
    //in other words, if all the fields are left blank, don't put a blank entry in the database
    if (inputType.value !== "" || inputDay.value !== "" || inputRating.value !== "") {
        fetch( '/submit', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then( res => res.json() )
        .then( getData )
    }
    getData()
}

const deriveField = function(rating) {
    //logic for determining meaning from the rating
    let meaning = 'default'
    if (rating < -10) {
      meaning = 'EGGTTOMMESWFTCEP'
    } else if (rating <= 2) {
      meaning = 'BAD, do not drink again'
    } else if (rating > 2 && rating <5) {
      meaning = 'not very good, probably will not drink again'
    } else if (rating >= 5 && rating <=7) {
      meaning = 'pretty average, maybe drink once in a while'
    } else if (rating > 7 && rating <=9) {
      meaning = 'very good! will drink often!'
    } else if (rating == 10) {
      meaning = 'my favorite!!'
    } else {
      meaning = 'rating does not compute'
    }
    return meaning;
}

const deleteRow = async function( event ) {
    event.preventDefault()
  
    const inputDay = document.querySelector( '#deleteByDate' ),
          inputType = document.querySelector( "#deleteByType")
          json = { day: inputDay.value,
                   type: inputType.value },
          body = JSON.stringify( json )
  
    fetch( '/remove', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
    .then( res => res.json() )
    .then( getData ) 

}

const update = async function ( event ) {
    event.preventDefault()
  
    const inputDay = document.querySelector( '#editByDate' ),
          inputType = document.querySelector( '#editByType'),
          newDay = document.querySelector('#dayEdit'),
          newType = document.querySelector('#typeEdit'),
          newRating = document.querySelector('#ratingEdit'),
          jsonUpdates = {}
    
    if (newDay.value !== "") {
        jsonUpdates.day = newDay.value
    }
    if (newType.value !== "") {
        jsonUpdates.type = newType.value
    }
    if (newRating.value !== "") {
        jsonUpdates.rating = newRating.value
        jsonUpdates.meaning = deriveField(newRating.value)
    }

    const json = { day: inputDay.value,
                   type: inputType.value,
                   updates: jsonUpdates },
          body = JSON.stringify( json )
  
    fetch( '/update', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
    .then( res => res.json() )
    .then( getData ) 
}


const showTable = function(data) {
    const table = document.querySelector('table') 
    table.innerHTML = ''

    //for recreating the column titles
    const tr = document.createElement('tr') 
    const th1 = document.createElement('th')
    const th2 = document.createElement('th')
    const th3 = document.createElement('th')
    const th4 = document.createElement('th')

    th1.innerText = "Date Consumed"
    tr.appendChild(th1)
    th2.innerText = "Tea Type"
    tr.appendChild(th2)
    th3.innerText = "Rating"
    tr.appendChild(th3)
    th4.innerText = "Meaning"
    tr.appendChild(th4)
    table.appendChild(tr)

    //filling in the data
    data.forEach ( item => {
            const tr = document.createElement('tr') 
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')
            const td3 = document.createElement('td')
            const td4 = document.createElement('td')
            
            td1.innerText = item.day
            tr.appendChild(td1)
            td2.innerText = item.type
            tr.appendChild(td2)
            td3.innerText = item.rating
            tr.appendChild(td3)
            td4.innerText = item.meaning
            tr.appendChild(td4)

            table.appendChild(tr)
        })
}
  
  
// const deleteRow = async function( event ) {
//     event.preventDefault()
  
//     const inputRow = document.querySelector( '#row' ),
//           json = { row: inputRow.value },
//           body = JSON.stringify( json )
  
//     const response = await fetch( '/delete', {
//       method:'DELETE',
//       body 
//     })
  
//     const data = await response.json()
//     showTable(data)
// }
  
// const update = async function( event ) {
//     event.preventDefault()
  
//     const inputRow = document.querySelector( '#rowEdit' ),
//           inputType = document.querySelector( '#typeEdit' ),
//           inputDay = document.querySelector( '#dayEdit' ),
//           inputRating = document.querySelector( '#ratingEdit' ),
//           json = { row: inputRow.value,
//                    type: inputType.value,
//                    day: inputDay.value,
//                    rating: inputRating.value },
//           body = JSON.stringify( json )
  
//     const response = await fetch( '/patch', {
//       method:'PATCH',
//       body 
//     })
  
//     const data = await response.json()
//     showTable(data)
// }
