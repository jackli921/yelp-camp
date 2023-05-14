const express = require("express");
const router = express.Router()
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { CampgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) => {
  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// display all campgrounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds, })
}))


// create new campground (must come before /:id)
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});


// save the campground to the database
router.post('/',isLoggedIn, validateCampground, catchAsync(async(req, res, next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
  
    const campground = new Campground(req.body.campground);
    await campground.save()
    req.flash("success", "successfully created campground");
    res.redirect(`/campgrounds/${campground._id}`)
}))


// display detail campground info
router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')

    if(!campground){
      req.flash('error', 'Cannot find that campground')
      res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground });


}))

// display edit page
router.get(
  "/:id/edit",
  isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// save edited data to db
router.put(
  "/:id", isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    req.flash('success', 'update successful!')
    res.redirect(`/campgrounds/${campground._id}`);
  })
);


router.delete(
  "/:id", isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router