const express = require("express");
const router = express.Router()
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campgrounds")
const {storage} = require("../cloudinary/index")
const multer = require("multer");
const parser = multer({storage, storage})

router.route('/')
  .get(catchAsync(campgroundController.index))
  .post(parser.array('image'), (req, res)=>{ 
    console.log(req.body, req.files)
    res.send("GOT!")
  })
  // .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route('/:id')
  .get(catchAsync(campgroundController.showCampground))
  .put(isLoggedIn, validateCampground, isAuthor, catchAsync(campgroundController.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router