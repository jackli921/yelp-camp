const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { ReviewSchema} = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// reviews
router.post('/new', validateReview, catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', 'new review added!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete("/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "successfully deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;