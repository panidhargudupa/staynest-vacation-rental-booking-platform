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
        url: String,
        filename: String
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
    // Array of references to the Review model to establish a relationship between listings and their reviews
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    // Reference to the User model to establish a relationship between listings and their owners
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
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