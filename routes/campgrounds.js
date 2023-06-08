const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema, reviewSchema} = require("../schema");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const Review = require('../models/review')
const campgrounds = require('../controllers/campgrounds')
const multer = require("multer");

const { storage, cloudinary } = require("../cloudinary/index");
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/:id", catchAsync(campgrounds.showCampground));
router.put("/:id", isLoggedIn, isAuthor, upload.array('image'), validateCampground,  catchAsync(campgrounds.updateCampground));
router.delete("/:id",isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router