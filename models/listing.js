const mongoose = require("mongoose");
const reviews = require("./reviews");
const Review = require("./reviews.js"); 

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
   image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg",
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg" : v.url || v,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

//post middleware to delete all reviews associated with a listing when the listing is deleted
listingSchema.post("findOneAndDelete", async function(listing) { 
    if(listing.reviews.length) { //checking if the listing has any reviews associated with it
    await Review.deleteMany({ 
        _id : { $in: listing.reviews }
    })
} else {
    console.log("No reviews to delete for this listing");
}})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;