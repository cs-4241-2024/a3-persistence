const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let leaderboard = [];

app.use(express.static("public"));
app.use(express.json());

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

app.post("/leaderboard", (req, res) => {
  const { name, score } = req.body;

  if (!name || !score) {
    return res.status(400).json({ error: "Name and score are required" });
  }

  const newEntry = {
    name: name,
    score: score,
    date: new Date().toLocaleString(),
  };

  leaderboard.push(newEntry);
  res.json(leaderboard);
});

app.delete("/leaderboard", (req, res) => {
  const { name, score, date } = req.body;

  leaderboard = leaderboard.filter(
    (entry) =>
      !(entry.name === name && entry.score === score && entry.date === date)
  );

  res.json(leaderboard);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});