// Controllers for reviews

const Review = require("../models/reviews");
const Listing = require("../models/listing");

// Create review
module.exports.createReview = async (req, res) => {
        const listing = await Listing.findById(req.params.id);

        const newReview = new Review(req.body.review);

        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created successfully!");

        res.redirect(`/listings/${listing._id}`);
}

// Delete review
module.exports.deleteReview = async (req, res) => { // Only logged in users who are the authors of the review can delete it

    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

     req.flash("success", "deleted review successfully!");
    res.redirect(`/listings/${id}`);
}
   
