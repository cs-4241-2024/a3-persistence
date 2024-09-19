// FRONT-END (CLIENT) JAVASCRIPT HERE
let credentials = {}

const login_success = function ( all_objects ) {
  document.querySelector('body').innerHTML = `
    <div>
      <div class="content-holder">
        <h2 class="label">
          Enter New Table Record
        </h2>
        <form>
          <div class='input-holder'>
            <label for="project-name">
              Project Name: 
            </label>
            <input type="text" id="project-name" value="Name">
          </div>
          <div class='input-holder'>
            <label for="yarn-count">
              Skein Count: 
            </label>
            <input type="number" id="yarn-count" value="0">
          </div>
          <div class='input-holder'>
            <label for="yarn-type">
              Yarn Type: 
            </label>
            <select id="yarn-type">
              <option value="None" selected="selected">Choose Type...</option>
              <option value="Chenille">Chenille</option>
              <option value="Worsted Weight">Worsted Weight</option>
              <option value="Acrylic">Acrylic</option>
              <option value="Velvet">Velvet</option>
              <option value="Cashmere Wool">Cashmere Wool</option>
              <option value="Faux Fur">Faux Fur</option>
            </select>
          </div>
          <div class='input-holder'>
            <p></p>
            <button class="submit" id="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
    <div>
      <div class="content-holder">
        <h2 class="label">
          Results    
        </h2>
        <table id="records">
          <tr id="field-lables">
            <th>Project Name</th>
            <th>Skeins Of Yarn</th>
            <th>Type Of Yarn</th>
            <th>Total Cost</th>
            <th>Delete</th>
          </tr>    
        </table>
      </div>
    </div>
  `
  
  const submit_button = document.querySelector("#submit");
  submit_button.onclick = submit;
  
  populate_table(all_objects)
}

const parse_login_response = async function ( response ) {
  const text = await response.text()
  
  if(text === "") {
    return;
  }
    
  const return_payload = JSON.parse(text)
  
  if (return_payload.login_state === false) {
    let error_box = document.querySelector( '#error-box' )
    error_box.innerHTML = return_payload.data
    return
  }
  
  let all_objects = return_payload.data
  
  login_success(all_objects)
}

const login = async function ( ) {
  let username = document.querySelector( '#username' )
  let password = document.querySelector( '#password' )
  
  credentials = {username: username.value, password: password.value}
  
  const body = JSON.stringify({payload: credentials})
    
  const response = await fetch( '/login', {
    method:'POST',
    body 
  })
  
  parse_login_response(response)
}

const make_new = async function ( ) {
  let username = document.querySelector( '#username' )
  let password = document.querySelector( '#password' )
  
  credentials = {username: username.value, password: password.value}
  
  const body = JSON.stringify({payload: credentials})
    
  const response = await fetch( '/make-new', {
    method:'POST',
    body 
  })

  parse_login_response(response)
}

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
    let remove_button_div = document.createElement('td')
    remove_button.classList.add('remove')
    remove_button.innerHTML = 'Remove'
    remove_button.onclick = (event) => remove(event, item.project_name)
    remove_button_div.appendChild(remove_button)
    record.appendChild(remove_button_div)
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
    
    const body = JSON.stringify({credentials: credentials, payload: payload})
  
    const response = await fetch( '/delete', {
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
  
  const body = JSON.stringify({credentials: credentials, payload: payload})
  
  const response = await fetch( '/submit', {
    method:'POST',
    body 
  })

  const text = await response.text()
  const all_objects = JSON.parse(text)
  
  populate_table(all_objects)
}

window.onload = async function() {
  const login_button = document.querySelector("#login");
  login_button.onclick = login;  
  const make_new_button = document.querySelector("#make-new");
  make_new_button.onclick = make_new;
}