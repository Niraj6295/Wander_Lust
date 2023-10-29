const data = require("./data.js")
const mongoose = require("mongoose"); 
const Listing = require("../models/listing.js");


let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(()=>console.log("Connected to DB"))
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}; 

const initDB = async()=>{
    await Listing.deleteMany({})
    data.data = data.data.map((obj)=>({
      ...obj,owner : "6530b5eba82c64afce795fa4",
    }));
    await Listing.insertMany(data.data)
    console.log("All data compleatedly saved");
};
initDB(); 