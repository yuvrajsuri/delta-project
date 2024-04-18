const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../Models/listings.js");

main()
.then((res)=>{
    console.log("connected to DB");
}
).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/trippy');
}

const initDB = async()=>{
    await Listing.deleteMany();
    initdata.data = initdata.data.map((obj)=>({
      ...obj,
      owner : "6607177fae37784d6093e232",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
};

initDB();