const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary")


module.exports.index = async (req, res) => {
  const allCampgrounds = await Campground.find({});
  res.render("campgrounds/index", { allCampgrounds });
};

module.exports.createCampground = async (req, res) => {
  // if(!req.body.campground) throw new ExpressError("Invalid Campground data", 400)
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map(f=> ({url: f.path, filename: f.filename}))
  await campground.save();
  req.flash("success", "New campground made!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};


module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect(`/campgrounds`);
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs)
  await campground.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Campground updated!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect(`/campgrounds`);
  }
  res.render("campgrounds/show", { campground });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCamp = await Campground.findByIdAndDelete(id);
  //delete associated reviews from Reviews collection to prevent orphaned reviews
  // if(deletedCamp){
  //     await Review.deleteMany({_id:{$in: deletedCamp.reviews}})
  // }
  req.flash("success", "Campground deleted!");
  res.redirect(`/campgrounds`);
};