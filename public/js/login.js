async function login() {
    
    const   user = document.querySelector( '#username' ),
            pass = document.querySelector( '#password' ),
            json = {username: user.value, password: pass.value},
            body = JSON.stringify( json )
  
    console.log(user.value + " and it's " + pass.value)
  
    const response = await fetch( '/login', {
    method:'POST',
    body 
    })
  
    console.log('waiting!!')

    let resp = await response.text()

    console.log(resp)

    //console.log("Logged in with user " + JSON.parse(resp).username + " and pass " + JSON.parse(resp).password)
  }