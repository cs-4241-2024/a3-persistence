
const login = async function(event) {

    event.preventDefault();
    const input = {user:document.getElementById( 'username' ), pass: document.getElementById("password") },
        json = { user: input.user.value, pass: input.pass.value },
        body = JSON.stringify( json )

    console.log("test:", body)

    const response = await fetch( '/login', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
    console.log(response.status)
    if(response.status === 200) {
        window.location.replace("main.html")
    }
    else{
        alert("Login failed")
    }

}

const newLogin = async function(event) {

    event.preventDefault();
    const input = {user:document.getElementById( 'username' ), pass: document.getElementById("password") },
        json = { user: input.user.value, pass: input.pass.value },
        body = JSON.stringify( json )


    const response = await fetch( '/newLogin', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })



    if(response.status === 200) {
        alert("New Login Created")
    } else {
        alert("No New Login Created")
    }
}
window.onload = async function() {
    const loginButton = document.getElementById("login")
    loginButton.onclick = login;

    const newLoginButton = document.getElementById("newLogin")
    newLoginButton.onclick = newLogin;

}
