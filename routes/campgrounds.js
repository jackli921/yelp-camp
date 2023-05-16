const express = require("express");
const router = express.Router()
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campgrounds")

// show all campgrounds
router.get('/', catchAsync(campgroundController.index))

// create new campground (must come before /:id)
router.get("/new", isLoggedIn, campgroundController.renderNewForm);


// show one campground in detail
router.get('/:id', catchAsync(campgroundController.showCampground))


// create a new campground
router.post('/',isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))


// display edit page
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

// update campground
router.put("/:id", isLoggedIn, validateCampground, isAuthor, catchAsync(campgroundController.updateCampground))


router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

module.exports = router