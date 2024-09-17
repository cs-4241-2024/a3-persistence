// FRONT-END (CLIENT) JAVASCRIPT HERE

const populate_table = function ( data ) {
  let records = document.querySelector( '#records' )
  let field_labels = document.querySelector( '#field-lables' )
  
  records.innerHTML = ''
  records.appendChild(field_labels)
  
  for (let item of data) {
    let record = document.createElement('tr')
    record.innerHTML += `
      <td>${item.project_name}</td>
      <td>${item.yarn_count}</td>
      <td>${item.yarn_type}</td>
      <td>$${item.total_cost}</td>
    `
    let remove_button = document.createElement('button')
    remove_button.innerHTML = 'Remove'
    remove_button.onclick = (event) => remove(event, item.project_name)
    record.appendChild(remove_button)
    records.appendChild(record)
  }
}

const gather_data = function () {
  const project_name_input = document.querySelector( '#project-name' )
  const yarn_count_input = document.querySelector( '#yarn-count' )
  const yarn_type_input = document.querySelector( '#yarn-type' )
  
  const payload = { 
    project_name: project_name_input.value,
    yarn_count: yarn_count_input.value,
    yarn_type: yarn_type_input.value
  }
  
  return payload;
}

const remove = async function ( event, project_name ) {
    event.preventDefault()
  
    const payload = { 
      project_name: project_name
    }
    
    const body = JSON.stringify({type: "remove", payload: payload})
  
    const response = await fetch( '/submit', {
      method:'POST',
      body 
    })
    
    const text = await response.text()
    const all_objects = JSON.parse(text)
  
    populate_table(all_objects)
    
}
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()

  const payload = gather_data()
  
  const body = JSON.stringify({type: "send", payload: payload})
  
  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  const all_objects = JSON.parse(text)
  
  
  populate_table(all_objects)
}

window.onload = async function() {
  const submit_button = document.querySelector("#submit");
  submit_button.onclick = submit;
  
  const body = JSON.stringify({type: "startup", payload: {}})
  
  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  
  if(text === "") {
    return;
  }
  
  const all_objects = JSON.parse(text)
  
  populate_table(all_objects)
}