const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews")

// create new review
router.post( "/new", isLoggedIn, validateReview, catchAsync(reviewController.createReview));

// delete review
router.delete( "/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;