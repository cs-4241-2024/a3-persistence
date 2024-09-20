import mongoose from "mongoose";
import "dotenv";
import {config} from "dotenv";
config();
const dburl = process.env.connectionurl;
console.log(dburl)
let conn = null;
try {
    conn = await mongoose.connect(process.env.connectionurl);
    console.log(conn)
} catch (e) {
    console.log(e);
}
export default conn;