const mongoose = require("mongoose"); 
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{  
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref :"User"
    },
    geometry:{
        type : {
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum :["room","iconic_cities","castel","mountain","pool","camping","farm","artic","dome","boat"]
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;