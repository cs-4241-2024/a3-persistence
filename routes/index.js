var express = require('express');
var router = express.Router();
const path = require('path'); // Import the path module

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Adjust the path as necessary
});

router.get('/bookmarks', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/bookmarks.html')); // Adjust the path as necessary
});

module.exports = router;
