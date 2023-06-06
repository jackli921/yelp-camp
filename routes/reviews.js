const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");
const {reviewSchema} = require("../schema")
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id //associate the new review with the current logged in user
    campground.reviews.push(review); 
    await review.save();
    await campground.save();
    req.flash("success", "Review added!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router