// // FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {

    event.preventDefault()


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
    const input = [name, cookie, icecream, other, cake]
    const body = JSON.stringify( input )

    const dict = {'name': name, 'cookie': cookie, 'icecream': icecream, 'other': other, 'cake': cake}


    const response = await fetch('/handlePost', {
        method:'POST',
        body
    })


    const tableT = document.getElementById("target")

    const textPre = await response.text();
    console.log(textPre)
    const text = JSON.parse(textPre);
    console.log(text)


    function addCellTwo(tr, text){
        const td = tr.insertCell();
        td.innerHTML = text;
        return td;
    }

    const row = tableT.insertRow();
    const nameVar = text[0]
    const cookieVar = text[1];
    const icecreamVar = text[2];
    const otherVar = text[3];
    const cakeVar = text[4];
    addCellTwo(row, nameVar)
    addCellTwo(row, cookieVar)
    addCellTwo(row, icecreamVar)
    addCellTwo(row, otherVar)
    addCellTwo(row, cakeVar)

    console.log("row")



    // const responseData = await fetch('/data',{
    //     method: 'GET'
    // })

    //const textPre = await responseData.text();
    //const text = JSON.parse(textPre);

    //console.log(text)
    //console.log(text[0].name.value)
    //fillTable(text)
    //fillTable(responseData)

    //console.log('text:',text)
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


window.onload = function() {
    //This allows you to bind you button to the event handler function submit above
    const buttonVariable = document.getElementById("button");
    if(buttonVariable.addEventListener)
        buttonVariable.addEventListener("click",submit,false);
    else if(buttonVariable.attachEvent)
        buttonVariable.attachEvent('onclick',submit)

    fetch('/data',{
        method: 'GET'
    }).then(response => response.json()).then(json=>{fillTable(json)})

    //button.onclick = submit
    //submit()
}
