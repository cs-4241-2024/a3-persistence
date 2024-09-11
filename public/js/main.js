// FRONT-END (CLIENT) JAVASCRIPT HERE
let clicks = 0;
let gameStarted = false;

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  if (clicks > 0) {
    const input =document.querySelector('#yourname');
    const json = { yourname: input.value, clicks: clicks };
    const body=JSON.stringify(json);
    const response = await fetch('/submit', {
      method: 'POST', body, headers: { 'Content-Type': 'application/json' },
    });
    const text = await response.json();
    console.log('text:', text);
    fetchHighScores();
  } else {
    alert('Click the button!!!');
  }
};
const fetchHighScores = async function () {
  const response = await fetch('/highscores');
  const highScores = await response.json();
  console.log('High scores:',highScores);  
  const highScoresList =document.querySelector('#high-scores-list');
  highScoresList.innerHTML= ''; 
  highScores.forEach((score) => {
    const li=document.createElement('li');
    li.textContent = `Player: ${score.player}, Clicks: ${score.clicks}, Date: ${score.date}`;
    highScoresList.appendChild(li);
  });
};
window.onload =function () {
  fetchHighScores(); 
  const form =document.querySelector('#name-form');
  form.onsubmit= submit;
  const clickButton =document.querySelector('#click-button');
  clickButton.onclick =function () {
    if (gameStarted) {
      clicks++;
      document.querySelector('#click-count').textContent =clicks;
    }
  };
  const startGameButton = document.querySelector('#start-game');
  startGameButton.onclick= function () {
    clicks =0;
    gameStarted =true;
    document.querySelector('#click-count').textContent= clicks;
    document.querySelector('#click-button').disabled =false;
    setTimeout(function () {
      gameStarted=false;
      document.querySelector('#click-button').disabled = true;
      alert('Game is Over!');
      submit(new Event('submit'));  
    }, 5000); 
  };
};
