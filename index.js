const express = require ('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema }= require("./schema")
const Campground = require('./models/campground')
const Review = require('./models/review')

async function main(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
        console.log("Connected to MongoDB")
    }
    catch(err){
        console.log('Error connecting to Mongodb', err)
    }
}

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

main()
const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const validateCampground = (req,res,next) =>{
    const { error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else{
        next()
    }
}

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/campgrounds", catchAsync(async (req,res)=>{
    const allCampgrounds = await Campground.find({}) 
    res.render("campgrounds/index", { allCampgrounds })
}))

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new")    
})


app.post("/campgrounds", validateCampground, catchAsync( async (req,res)=>{
    // if(!req.body.campground) throw new ExpressError("Invalid Campground data", 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


//server the edit form
app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})  
}))


//update the campground
app.put('/campgrounds/:id', validateCampground, catchAsync(async(req,res)=>{   
    const {id }= req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`)
}))

app.get("/campgrounds/:id", catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

// delete campground
app.delete("/campgrounds/:id", catchAsync(async (req,res)=>{
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id)
    //delete associated reviews from Reviews collection to prevent orphaned reviews  
    // if(deletedCamp){
    //     await Review.deleteMany({_id:{$in: deletedCamp.reviews}})
    // }
    res.redirect(`/campgrounds`)
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete review

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{ reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId) 
    res.redirect(`/campgrounds/${id}`)
}))


app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const { status = 500 } = err
    if(!err.message) error.message = "Something went wrong"
    res.status(status).render('error', {err})
})

app.listen(3000, ()=>{
    console.log("Serving on port 3000")
})