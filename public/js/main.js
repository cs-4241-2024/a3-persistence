// // FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function( event ) {

    event.preventDefault()


    console.log("I have submitted")
    const name = document.getElementById('name').value
    const cookie = document.getElementById('cookie').value
    const icecream = document.getElementById('icecream').value
    const other = document.getElementById('other').value
    const iceCreamLower = icecream.toLowerCase()
    let cake = ''
    if(iceCreamLower == 'vanilla'){
        cake = 'vanilla cake'
    }else if(iceCreamLower == 'chocolate'){
        cake = 'chocolate cake'
    }else{
        cake = 'no cake!'
    }
    //const input = [name, cookie, icecream, other, cake]
    //const body = JSON.stringify( input )

    const dict = {'name': name, 'cookie': cookie, 'icecream': icecream, 'other': other, 'cake': cake}
    console.log(dict)
    const body = JSON.stringify(dict)
    console.log(body)


    const response = await fetch('/submit', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })


    const tableT = document.getElementById("target")

    const textPre = await response.text();
    console.log(textPre)
    const text = JSON.parse(textPre);
    console.log(text)

    //swapping text for dict
    function addCellTwo(tr, dict){
        const td = tr.insertCell();
        td.innerHTML = dict;
        return td;
    }

    const row = tableT.insertRow();
    // const nameVar = text[0]
    // const cookieVar = text[1];
    // const icecreamVar = text[2];
    // const otherVar = text[3];
    // const cakeVar = text[4];
    const nameVar = name
    const cookieVar = cookie
    const icecreamVar = icecream
    const otherVar = other
    const cakeVar = cake
    addCellTwo(row, nameVar)
    addCellTwo(row, cookieVar)
    addCellTwo(row, icecreamVar)
    addCellTwo(row, otherVar)
    addCellTwo(row, cakeVar)

    console.log("row")

}

const fillTable = function( dict ) {
    /* I don't think you are doing this correctly */
// I would look explore this https://stackoverflow.com/questions/46157018/dynamically-populate-data-into-table-using-javascript
//This is similar to what the professor is suggesting
//You need to iterate over text and populate the table it will be something like text[iterator].<property> to get a particular value in the json
    const table = document.getElementById("target")

    function addCell(tr, text){
        const td = tr.insertCell();
        td.innerHTML = text;
        return td;
    }

    console.log("fill table")
    console.log(dict)
    dict.forEach(function (item){
        const row = table.insertRow();
        const name = item["name"];
        const cookie = item["cookie"];
        const icecream = item["icecream"];
        const other = item["other"];
        const cake = item["cake"];
        addCell(row, name)
        addCell(row, cookie)
        addCell(row, icecream)
        addCell(row, other)
        addCell(row, cake)
    })
}

const deleteVar = async function(event){
    console.log("I am deleteing")
    event.preventDefault()

    console.log("delete")

    const name = document.getElementById('name').value
    const cookie = document.getElementById('cookie').value

    const dict = {'name': name, 'cookie': cookie}
    const body = JSON.stringify(dict)


    const response = await fetch('/remove', {
        method:'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    console.log("im here 1")
    const tableT = document.getElementById('target')
    console.log("im here 2")
    deleteRowItem()
    function deleteRowItem(){
        var i;
        for(i = 0; i < tableT.rows.length; i++){
            console.log("inside for")
            var row = tableT.rows[i]
            console.log(row)
            var cellOne = row.cells[0]
            var cellTwo = row.cells[1]
            var cellOneValue = cellOne.innerHTML
            var cellTwoValue = cellTwo.innerHTML
            console.log(cellOneValue)
            console.log(cellTwoValue)
            if(cellOneValue == name && cellTwoValue == cookie){
                tableT.deleteRow(i)
            }
        }
    }
}

const updateInfo = async function (event){
    event.preventDefault()
    const name = document.getElementById('name').value
    const cookie = document.getElementById('cookie').value
    const icecream = document.getElementById('icecream').value
    const other = document.getElementById('other').value
    const dict = {'name': name, 'cookie': cookie, 'icecream': icecream, 'other': other}
    const body = JSON.stringify(dict)

    const response = await fetch('/update', {
        method:'PUT',
        headers: { 'Content-Type': 'application/json' },
        body
    })

    const tableT = document.getElementById('target')

    updateAppRow()

    function updateAppRow(){
        console.log("Im in the for")
        var i;
        for(i = 0; i < tableT.rows.length; i++){
            var row = tableT.rows[i]
            console.log(row)
            var cellOne = row.cells[0]
            var cellTwo = row.cells[1]
            var cellThree = row.cells[2]
            var cellFour = row.cells[3]
            var cellOneValue = cellOne.innerHTML
            var cellTwoValue = cellTwo.innerHTML
            var cellThreeValue = cellThree.innerHTML
            var cellFourValue = cellFour.innerHTML
            console.log(cellOneValue)
            console.log(cellTwoValue)
            if(cellOneValue == name){
                console.log("changing" +cellTwo.innerHTML)
                cellTwo.innerHTML = cookie;
                console.log("changing" +cellTwo.innerHTML)
                cellThree.innerHTML = icecream;
                console.log("changing" +cellThree.innerHTML)
                cellFour.innerHTML = other;
                console.log("changing" +cellFour.innerHTML)

            }
        }
    }

    //console.log("hit the updatebutton")

}


//
window.onload = function() {
    //This allows you to bind you button to the event handler function submit above
    // const buttonVariable = document.getElementById("button");
    // if(buttonVariable.addEventListener)
    //     buttonVariable.addEventListener("click",submit,false);
    // else if(buttonVariable.attachEvent)
    //     buttonVariable.attachEvent('onclick',submit)
    const buttonVariable = document.getElementById("button")
    buttonVariable.onclick = submit

    const buttonDelete = document.getElementById("deletebutton")
    buttonDelete.onclick = deleteVar

    const buttonUpdate = document.getElementById("updateButton")
    buttonUpdate.onclick = updateInfo

    // const buttonDelete = document.getElementbyId("deletebutton")
    // if(buttonDelete.addEventListener){
    //   buttonDelete.addEventListener("click1",deleteVar,false);
    // }
    // else if(buttonDelete.attachEvent){
    //   buttonDelete.attachEvent('onclick1',deleteVar)
    // }

    console.log("response")
    fetch('/data',{
        method: 'GET'
    }).then(response => response.json()).then(json=>{fillTable(json)})
    //then(response => console.log("response"))
    const uName = sessionStorage.getItem('uname')
    console.log(uName)

    //button.onclick = submit
    //submit()
}
