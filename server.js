const express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    fs = require('fs'),
    path = require('path'),
    app = express(),
    port = process.env.PORT || 3000,
    key = 'secretkey',
    uri = 'mongodb://localhost:27017/habit-tracker',
    bcrypt = require('bcrypt'),
    client = new MongoClient(uri),
    jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.static('public'));


let habitList;
let usersList;

// connect to db
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db("habit-tracker");
  habitList = db.collection('habits');
  usersList = db.collection('users');

  habitList.countDocuments({}, (err, count) => {
    if (err) {
      console.error('Error counting documents:', err);
    } else {
      console.log(`Number of habits in the database: ${count}`);
    }
  });
});

// index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// add registration if time allows
// login
app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await usersList.findOne({username});
    if(!user) {
      return res.status(401).send('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if(!passwordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({userID: user._id}, key, {expiresIn: '1h'});
    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hash
    };

    await usersList.insertOne(newUser);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
})

// authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    req.user = jwt.verify(token, key);
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// get habits
app.get('/getHabits', authenticate, async (req, res) => {
  try {
    const habits = await habitList.find({userID: req.user.userID}).toArray();
    res.json(habits);
  } catch (err) {
    res.status(500).send('Error getting habits');
  }
});

// add habit
app.post('/addHabit', authenticate, async (req, res) => {
  const {habitName, startDate, frequency} = req.body;
  const habitDate = new Date(startDate);
  const currentDate = new Date();
  const msToDay = 1000 * 60 * 60 * 24;
  let consistency = '';

  if (habitDate < currentDate) {
    consistency = Math.floor((currentDate - habitDate) / msToDay ) + " days";
  } else if (habitDate > currentDate) {
        consistency = "Not Started";
  } else {
        consistency = "0 days"
  }

  const newHabit = {
    habitName,
    startDate,
    frequency,
    consistency,
    userID: req.user.userID
  };

  try {
    await habitList.insertOne(newHabit);
    const updatedHabits = await habitList.find({userID: req.user.userID}).toArray();
    res.json(updatedHabits);
  } catch (err) {
    res.status(500).send('Error adding habit');
  }
})

// delete habit
app.delete('/deleteHabit', authenticate, async (req, res) => {
  const {habitName} = req.body;

  try {
    await habitList.deleteOne({habitName, userID: req.user.userID});
    const updatedHabits = await habitList.find({userID: req.user.userID}).toArray();
    res.json(updatedHabits);
  } catch (err) {
    res.status(500).send('Error deleting habit');
  }
})

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})






// const file = path.join(__dirname, 'data.json');
// let appdata = [
//   {'habitName': 'Exercise', 'startDate': '2024-09-03', 'frequency': 'daily', 'consistency': 'In Progress'}
// ]
// //
// try {
//   if (fs.existsSync(file)) {
//     const fileContent = fs.readFileSync(file, 'utf8');
//     if (fileContent) {
//       appdata = JSON.parse(fileContent);
//     }
//   }
// } catch (err) {
//   console.error('Error reading data file:', err);
// }
// //
// const server = http.createServer( function( request,response ) {
//   if( request.method === 'GET' ) {
//     handleGet( request, response )
//   }else if( request.method === 'POST' ){
//     handlePost( request, response )
//   } else if( request.method === 'DELETE' ){
//     handleDelete(request, response)
//   }
// })
//
// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 )
//
//   if( request.url === '/' ) {
//     sendFile( response, 'public/index.html' )
//   } else if (request.url === '/getHabits') {
//     response.writeHead(200, { 'Content-Type': 'application/json' });
//     response.end(JSON.stringify( appdata ) );
//   } else{
//     sendFile( response, filename )
//   }
// }
//
// const handlePost = function( request, response ) {
//   let dataString = ''
//
//   request.on( 'data', function( data ) {
//       dataString += data
//   })
//
//   request.on( 'end', function() {
//     if(request.url === '/addHabit') {
//       const newHabit = JSON.parse( dataString );
//       const habitDate = new Date(newHabit.startDate);
//       const currentDate = new Date();
//       const msToDay = 1000 * 60 * 60 * 24;
//
//
//       if (habitDate < currentDate) {
//         console.log(Math.abs((currentDate - habitDate) / msToDay ));
//         newHabit.consistency = Math.floor((currentDate - habitDate) / msToDay ) + " days";
//       } else if (habitDate > currentDate) {
//         newHabit.consistency = "Not Started";
//       } else {
//         newHabit.consistency = "0 days"
//       }
//
//       appdata.push(newHabit);
//       try {
//         fs.writeFileSync(file, JSON.stringify( appdata, null, 2 ), 'utf8' );
//       } catch (err) {
//         console.error('Error writing to data file:', err);
//       }
//
//
//       response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
//       response.end(JSON.stringify(appdata));
//     }
//   })
// }
//
// const handleDelete = function( request, response ) {
//   let dataString = '';
//   request.on( 'data', function( data ) {
//     dataString += data;
//   });
//
//   request.on( 'end', function() {
//     const {habitName} = JSON.parse( dataString );
//     //
//     if (habitName === undefined) {
//       console.error('Habit name is undefined');
//       response.writeHead(400, {'Content-Type': 'application/json'});
//       response.end(JSON.stringify({ error: 'Habit name is undefined' }));
//       return;
//     }
//     //
//     appdata = appdata.filter(habit => habit.habitName !== habitName);
//     fs.writeFileSync(file, JSON.stringify( appdata, null, 2 ) );
//     response.writeHead( 200, {'Content-Type': 'application/json' });
//     response.end(JSON.stringify(appdata));
//   })
// }
//
// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename )
//
//    fs.readFile( filename, function( err, content ) {
//
//      // if the error = null, then we've loaded the file successfully
//      if( err === null ) {
//
//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { 'Content-Type': type })
//        response.end( content )
//
//      }else{
//
//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( '404 Error: File Not Found' )
//
//      }
//    })
// }
//
// server.listen( process.env.PORT || port )
