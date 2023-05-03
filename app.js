const express = require('express')
const mongoose = require("mongoose");
const path = require("path");
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('joi')

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
app.get('/campgrounds', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

// create new campground (must come before /:id)
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// save the campground to the database
app.post('/campgrounds', catchAsync(async(req, res, next)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const campgroundSchema = Joi.object({ 
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),

        }).required()
    })
    const { error} = campgroundSchema.validate(req.body)
    console.log(error)

    if(error){
        const msg = error.details.map( el => el.message).join('')
        throw new ExpressError(msg, 400)
    }

    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// display detail campground info
app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/show", { campground });
}))

// display edit page
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
}))

// save edited data to db
app.put('/campgrounds/:id', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

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