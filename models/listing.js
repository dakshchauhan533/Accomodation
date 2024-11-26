const { ref, object } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")
const listingschema = new Schema({
    title:String,
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    Geometry: {
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
})

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}});
    }
})

const listing = mongoose.model("listing",listingschema);
module.exports  = listing;