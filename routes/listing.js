const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, isAuthor } = require("../middleware");
const { isLoggedIn } = require("../middleware"); // Importing the isLoggedIn middleware to protect certain routes

const multer = require("multer"); // Importing multer, a middleware for handling multipart/form-data, which is primarily used for uploading files.
const { storage } = require("../cloudConfig"); // Importing the storage configuration from the cloudconfig file, which is set up to use Cloudinary for storing uploaded files.
const upload = multer({ storage }); // Configuring multer to store uploaded files in the "uploads" directory

const listingController = require("../controllers/listings");// Importing the listing controller to handle the logic for each route


router.route("/") // Defining routes for the root path of listings
          //Index Route
          .get(wrapAsync(listingController.index)) // Route to display all listings, using the index method from the listing controller, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.
          // Create Route
          .post(isLoggedIn,validateListing,
                    upload.single("listing[image]"), // Middleware to handle the file upload for the listing image, allowing users to upload a single image file associated with the listing, and specifying the field name in the form as "listing[image]" to match the expected format for handling nested form data in Express.
                    wrapAsync(listingController.create)); // Route to handle the creation of a new listing, protected by both the isLoggedIn and isAuthor middleware to ensure that only authenticated users who are the authors can create a listing, and using the create method from the listing controller to handle the logic for creating a new listing, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.
          
// NEW
router.get("/new",isLoggedIn, listingController.new); // Route to display the form for creating a new listing, protected by the isLoggedIn middleware to ensure that only authenticated users can access this route, and using the new method from the listing controller to render the form view.


router.route("/:id") // Defining routes for a specific listing identified by its ID
          // Show Route
          .get(wrapAsync(listingController.show)) // Route to display the details of a specific listing, identified by its ID in the URL, using the show method from the listing controller to fetch the listing data and render the appropriate view, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.
          // Update Route
          .put(isLoggedIn,isAuthor,validateListing,
                    upload.single("listing[image]"),// Middleware to handle the file upload for the listing image when updating a listing, allowing users to upload a new image file associated with the listing, and specifying the field name in the form as "listing[image]" to match the expected format for handling nested form data in Express.
                    wrapAsync(listingController.update)) // Route to handle the updating of an existing listing, identified by its ID in the URL, protected by both the isLoggedIn and isAuthor middleware to ensure that only authenticated users who are the authors can update a listing, and using the update method from the listing controller to handle the logic for updating the listing, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.
          // Delete Route
          .delete(isLoggedIn,isAuthor, wrapAsync(listingController.delete)); // Route to handle the deletion of an existing listing, identified by its ID in the URL, protected by both the isLoggedIn and isAuthor middleware to ensure that only authenticated users who are the authors can delete a listing, and using the delete method from the listing controller to handle the logic for deleting the listing, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.

// EDIT
router.get("/:id/edit",isLoggedIn,isAuthor, wrapAsync(listingController.edit)); // Route to display the form for editing an existing listing, identified by its ID in the URL, protected by both the isLoggedIn and isAuthor middleware to ensure that only authenticated users who are the authors of the listing can access this route, and using the edit method from the listing controller to fetch the listing data and render the edit form view, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.

module.exports = router;