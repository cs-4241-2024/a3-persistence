window.onload = function () {
    document.getElementById("welcome").innerHTML = "Welcome " + Cookies.get("Username");
    updateTable();
  
    //.then(json => { updateTable(json) })
  }