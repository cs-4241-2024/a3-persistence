const submit = async function( event ) {

    event.preventDefault()

    window.location.href = "/index.html"
}

window.onload = function() {
    const login = document.getElementById( 'login' )
    login.onclick = submit
  }