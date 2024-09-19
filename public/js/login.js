async function login( event ) {
    
    event.preventDefault()

    const   user = document.querySelector( '#username' ),
            pass = document.querySelector( '#password' ),
            json = {username: user.value, password: pass.value},
            body = JSON.stringify( json )
  
    console.log(user.value + " and it's " + pass.value)
    console.log(body)
  
    const response = await fetch( '/login', {
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body
    })
  
    console.log('waiting!!')

    let resp = await response.text()

    console.log(resp)

  }