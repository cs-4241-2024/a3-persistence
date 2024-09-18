const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  

  const input = document.getElementsByClassName("In"),
        json = input[0],
        body = JSON.stringify(json);
  
  console.log(body);

  const response = await fetch("/update", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();

  console.log("text:", text);
};

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}