const express = require("express");
const router = express.Router()
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { CampgroundSchema } = require("../schemas.js");


const validateCampground = (req, res, next) => {
  const { error } = CampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


// create new campground (must come before /:id)
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// display detail campground info
router.get('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render("campgrounds/show", { campground });
}))

// display edit page
router.get('/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
}))

// save edited data to db
router.put(
  "/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// display all campgrounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds, })
}))


// save the campground to the database
router.post('/', validateCampground, catchAsync(async(req, res, next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
  
    const campground = new Campground(req.body.campground);
    await campground.save()
    req.flash("success_created", "successfully created campground");
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success_deleted", "successfully deleted campground");
    res.redirect("/campgrounds");
  })
);



module.exports = router