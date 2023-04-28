const express = require('express')
const mongoose = require("mongoose");
const path = require("path");
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", ()=>{
    console.log("database connected")
})


const app = express();


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', (req,res)=>{
    res.render('home')
})

// display all campgrounds
app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

// create new campground (must come before /:id)
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// save the campground to the database
app.post('/campgrounds', async(req, res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

// display detail campground info
app.get('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/show", { campground });
})

// display edit page
app.get('/campgrounds/:id/edit', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
})

// save edited data to db
app.put('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete 
app.delete('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})