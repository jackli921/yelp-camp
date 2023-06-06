const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema, reviewSchema} = require("../schema");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const Review = require('../models/review')
const Campground = require('../models/campground')


router.get("/", catchAsync(async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground data", 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash("success", "New campground made!");
    res.redirect(`/campgrounds/${campground._id}`);

  })
);

//server the edit form
router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect(`/campgrounds`);
    }
    res.render("campgrounds/edit", { campground });
  })
);

//update the campground
router.put("/:id", validateCampground, isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.get("/:id", catchAsync(async (req, res) => {
       const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', "Cannot find that campground!")
        return res.redirect(`/campgrounds`)
    }
    res.render("campgrounds/show", { campground });
  }) 
);

// delete campground
router.delete("/:id",isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    //delete associated reviews from Reviews collection to prevent orphaned reviews
    // if(deletedCamp){
    //     await Review.deleteMany({_id:{$in: deletedCamp.reviews}})
    // }
    req.flash("success", "Campground deleted!")
    res.redirect(`/campgrounds`);
  })
);


module.exports = router