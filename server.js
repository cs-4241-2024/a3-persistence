const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
app.use(express.static("public"))
app.use(express.json())
const uri = `mongodb+srv://supermanbritt2003:${process.env.db_password}@a3.cfniv.mongodb.net/?retryWrites=true&w=majority&appName=A3`
const client = new MongoClient(uri)

let collection = null

async function run() {
	await client.connect()
	collection = await client.db("A3").collection("test");
}
run();

//Get to-do list data
app.get("/data/:username", async (req, res) => {
	if (collection !== null) {
		const username = req.params.username;
		const docs = await collection.find({ Username: username }).toArray();
		res.end(JSON.stringify(docs))
	}
})

//Submit new to-do list item
app.post('/submit', async (req, res) => {
	const result = await collection.insertOne(req.body);
	// res.json(result);
	res.end(JSON.stringify(result));
})

app.post('/logIn', async (req, res) => {
	const username = req.body.Username;
	const password = req.body.Password;
	const searchResults = await collection.find({ Username: username }).toArray();//might need to be a string
	if (searchResults.length > 0) {
		console.log("Username exists")
		//There is a matching username
		const tempUsername = searchResults[0].Username;
		const tempPassword = searchResults[0].Password;
		console.log("tempUsername " + tempUsername);
		console.log("tempPassword " + tempPassword);
		console.log(JSON.stringify(searchResults));
		if (tempPassword == password) {
			//Password matches
			res.end(JSON.stringify(searchResults[0]))
		}
		else {
			//Password is wrong
			res.end(JSON.stringify(searchResults[0]))
		}
	}
	else {
		//Insert new username and password
		const result = await collection.insertOne(req.body);
		res.end(JSON.stringify(result))
	}
})

app.post('/delete', async (req, res) => {
	const result = await collection.deleteOne(req.body);//need to get the data for the last item
	// res.json(result);
	res.end(JSON.stringify(result));
})

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));