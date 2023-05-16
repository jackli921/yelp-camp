const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
};

module.exports.details = (async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("reviews");

  if (!campground) {
    req.flash("error", "Cannot find that campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});


module.exports.createCampground = async (req, res, next) => {
  // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)

  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash("success", "successfully created campground");
  res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  req.flash("success", "update successful!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "successfully deleted campground");
  res.redirect("/campgrounds");
};