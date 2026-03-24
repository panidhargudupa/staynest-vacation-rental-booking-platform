const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressErr.js")
const listingSchema = require('./schema.js')
const Review = require("./models/reviews.js"); 


//CONNECTING WITH MOONGOOSE
const mongo_url = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
    await mongoose.connect(mongo_url)
}

//SETTING VIEW ENGINE
app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err)
    })



//REQ AND RES ROUTINGS (1)
app.get('/', (req,res)=> {
    res.send("request recieved");
})


//validate listing middleware
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw(new ExpressError(400,errMsg))
    } else {
        next();
    }
}


//validate review middleware
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw(new ExpressError(400,errMsg))
    } else {
        next();
    }  
}

//INDEX ROUTE (2)
app.get('/listings', wrapAsync(async (req,res,next) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400,'send valid data for listing')
    // }
    
    const allListings = await Listing.find({})  
    // if(!newListing.title) {
    //     throw new ExpressError(400,'title is missing')
    // }
    // if(!newListing.description) {
    //     throw new ExpressError(400,'Description is missing')
    // }
    // if(!newListing.location) {
    //     throw new ExpressError(400,'location is  missing')
    // }
    res.render("listings/index.ejs", {allListings});
    
}));

//NEW ROUTE (3)
app.get('/listings/new', ((req,res) => {
    res.render("listings/new.ejs")
}));

//EDIT ROUTE (4.1)
app.get('/listings/:id/edit',wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
}))

//UPDATE ROUTE (4.2)
app.put('/listings/:id',validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listings/${id}`);
}))

//DELETE ROUTE (5)
app.delete('/listings/:id',wrapAsync( async(req,res) => {
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id)
   console.log(deleteListing);
   res.redirect('/listings'); 
}))

//Review Create Post Route (6)
app.post('/listings/:id/reviews',wrapAsync(async (req,res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);   

    await newReview.save();
    await listing.save();

    console.log(newReview);

    res.redirect(`/listings/${listing._id}`);
}));

//review delete route (7)
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async (req,res) => {   
    const {id, reviewId} = req.params; //destructuring the listing id and review id from the request parameters
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //mongoose operator to pull the review id from the reviews array of the listing
    await Review.findByIdAndDelete(reviewId); //deleting the review document from the reviews collection
    res.redirect(`/listings/${id}`); //redirecting back to the listing show page after deletion
}))



//server side validation for review
app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req,res) => {
    const listing = await Listing.findById(req.params.id);
    const {error} = reviewSchema.validate(req.body.review);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw(new ExpressError(400,errMsg))
    } else {
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
    }
}));

//SHOW ROUTE (3)
app.get('/listings/:id' ,wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));



//CREATE ROUTE FOR NEW ROUTE (2)
app.post('/listings',validateListing,wrapAsync(async (req,res) => {
    console.log(req.body);
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect('/listings');
}));


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


//error handling MIDDLEWARE
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", {message});

    //res.status(statusCode).send(message);
});


//(CONTINUE 1)
app.listen(8080, ()=>{
    console.log("server is listening port: 8080")
});

//CREATED A SMAPLE ROUTE
// app.get('/testListing', async (req,res)=> {
//     let sampleListing = new Listing ({
//         title: "My Home",
//         description: "By the beach",
//         price: 1200,
//         location: "Mysore",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log("smaple was saved");
//     res.send("successful");
// });


