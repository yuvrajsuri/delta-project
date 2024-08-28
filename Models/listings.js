const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require('./User.js')


const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{url : {
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theguardian.com%2Ffilm%2F2019%2Foct%2F09%2Fweek-in-geek-joaquin-phoenix-joker-must-be-isolated-from-batman-dc-comics&psig=AOvVaw0bO80TAicyGJQvk9Xb4R-M&ust=1710335173035000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLjFt5vl7oQDFQAAAAAdAAAAABAE",
        set:(v)=> v==="" ?"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.theguardian.com%2Ffilm%2F2019%2Foct%2F09%2Fweek-in-geek-joaquin-phoenix-joker-must-be-isolated-from-batman-dc-comics&psig=AOvVaw0bO80TAicyGJQvk9Xb4R-M&ust=1710335173035000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLjFt5vl7oQDFQAAAAAdAAAAABAE":v,
    },
    filename : String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
        },
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({ _id : { $in : listing.reviews}});
    }
});

const listing = mongoose.model("Listing",listingSchema);

module.exports = listing;

