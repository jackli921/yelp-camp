const express = require("express");
const router = express.Router()
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { CampgroundSchema } = require("../schemas.js");
const campgroundController = require("../controllers/campgrounds");
const campground = require("../models/campground");

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
router.get("/", catchAsync(campgroundController.index));

// create new campground (must come before /:id)
router.get("/new", campgroundController.renderNewForm);

// display detail campground info
router.get("/:id", catchAsync(campgroundController.details));

// create new campground to the database
router.post('/', validateCampground, catchAsync(campgroundController.createCampground))

// display edit page
router.get('/:id/edit', catchAsync(campgroundController.renderEditForm))

// save edited data to db
router.put(
  "/:id", validateCampground, catchAsync(campgroundController.editCampground)
);

router.delete(
  "/:id",
  catchAsync(campgroundController.deleteCampground)
);

module.exports = router