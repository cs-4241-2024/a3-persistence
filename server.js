const express = require('express');
const app = express();
const dreams = [];

// Serve static files from 'public' and 'views'
app.use(express.static('public'));
app.use(express.static('views'));

// Serve index.html for root request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Middleware for handling JSON requests
app.use(express.json());

// Handle POST requests to '/submit'
app.post('/submit', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  dreams.push(req.body.newdream);
  res.end(JSON.stringify(dreams));
});

// Start the server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
