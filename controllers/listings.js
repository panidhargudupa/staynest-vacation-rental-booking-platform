// controllers/listings.js which is the listing controller that contains the logic for handling the various routes related to listings in the application. Each method in this controller corresponds to a specific route and handles the necessary database operations and rendering of views for that route. The methods include:

const Listing = require('../models/listing');

// INDEX
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{ allListings });
}

// NEW
module.exports.new = async (req,res)=>{ // Only logged in users can access the form to create a new listing
    res.render("listings/new");
}

// SHOW
module.exports.show = async(req,res)=>{
    const listing = await Listing.findById(req.params.id)
    // Populate the reviews and owner fields to display the associated data in the listing details page
        .populate({path: "reviews",populate: { path: "author" } }) // Populate the reviews and their authors(nested population )
        .populate("owner"); 
    if(!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
          
    }
    res.render("listings/show",{ listing });
}

// EDIT
module.exports.edit = async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit",{ listing });
}

// CREATE
module.exports.create = async(req,res)=> { // Only logged in users can create a new listing, and the listing data is validated using the validateListing middleware
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged in user
    newListing.image = { url, filename }; // Set the image field of the listing to the URL and filename of the uploaded image, which is handled by multer and stored in Cloudinary based on the configuration in cloudconfig.js
    await newListing.save();
    if(!newListing) {
          req.flash("error", "Failed to create listing!");  
          res.redirect("/listings/new");
    }     
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}

// UPDATE
module.exports.update = async(req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
     req.flash("success", "Updated successfully!");
    res.redirect(`/listings/${req.params.id}`);
}

// DELETE
module.exports.delete = async(req,res)=>{
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}