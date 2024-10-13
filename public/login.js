const submit = async function( event ) {

    event.preventDefault()

    json = {
        user: document.getElementById("username").value,
        pass: document.getElementById("password").value
    }

    fetch( '/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify( json )
    }).then(() => window.location.href = '/index.html')
}

window.onload = function() {
    const login = document.getElementById( 'login' )
    login.onclick = submit
}