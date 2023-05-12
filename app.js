const express = require('express')
const mongoose = require("mongoose");
const path = require("path");
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')

const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
const app = express();

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log("database connected")
})
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))

app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: "sessionsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
  },
};
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next)=>{
    res.locals.success_deleted = req.flash('success_deleted')
    res.locals.success_created = req.flash("success_created");
    next()
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use(express.static('public'))

app.all('*', (req, res, next)=>{
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next)=>{
    const {status = 500 , message = 'Something went wrong' } = err
    if(!err.message) error.message = 'Something Went Wrong!'
    res.status(status).render('error', {err})
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})


