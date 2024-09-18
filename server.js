/*
Note -> all express routes are written in the routes directory. This file only serves the right route for the given HTTP request 
*/ 
//import routes
import PurchaseItem from "./mongoose/purchases/schema.js"; 
import exampleRoute from "./routes/exampleRoute.js"; 
import addPurchase from "./routes/addPurchase.js"; 
import deletePurchase from "./routes/deletePurchase.js"; 
import getResults from "./routes/getResults.js"; 
import updatePurchase from "./routes/updatePurchase.js"; 
import deleteAll from "./routes/deleteAll.js"; 
import cors from 'cors';





//start dotenv
import dotenv from 'dotenv'; 
dotenv.config(); 
//start mongoose
import { mongoose } from 'mongoose';
mongoose.connect(process.env.ATLAS_URI); 
//start express
import express from 'express'; 
const app = express(); 
app.use(express.static('public')); 
app.use(express.json()); 
app.use(cors({origin:'https://a3-vivekjag1.vercel.app/'})); 




//middleware for post requests so that requests have a body with the incoming data
const postMiddleware = (req, res, next) => { 
    const dataArr = []; 
    let dataString = ''; 
    req.on('data', (data) =>{ 
        dataString += data; 

    }); 
    req.on('end', () => { 
        
        const json = JSON.parse(dataString); 
        dataArr.push(json); 
        req.body = JSON.stringify(json); 
        next(); 
    })
}

//basic route used to test API and MongoDB atlas health
app.get('/', async (req, res) =>{
    res.send('Hello'); 
    const test = await PurchaseItem.countDocuments({}); 
}); 
//attach routes

//gets first


app.use(exampleRoute); 
app.use(getResults); 
app.use(deleteAll); 

app.use(postMiddleware); 

app.use(addPurchase); 
app.use(deletePurchase); 
app.use(updatePurchase); 
app.listen(process.env.PORT || 3000); 