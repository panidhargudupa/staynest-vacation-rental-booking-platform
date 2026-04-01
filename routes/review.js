const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn,  isReviewAuth } = require("../middleware");

const reviewController = require("../controllers/reviews"); // Importing the review controller to handle the logic for each review-related route


// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,validateReview,
    wrapAsync(reviewController.createReview)); // Route to handle the creation of a new review for a specific listing, protected by the isLoggedIn middleware to ensure that only authenticated users can create reviews, and using the validateReview middleware to validate the review data before passing it to the createReview method from the review controller, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.


// DELETE REVIEW
router.delete("/:reviewId",
    isLoggedIn,isReviewAuth, 
    wrapAsync(reviewController.deleteReview)); // Route to handle the deletion of an existing review, identified by its ID in the URL, protected by both the isLoggedIn and isReviewAuth middleware to ensure that only authenticated users who are the authors of the review can delete it, and using the deleteReview method from the review controller to handle the logic for deleting the review, wrapped in the wrapAsync utility to handle any asynchronous errors that may occur during the execution of the route handler.


module.exports = router;