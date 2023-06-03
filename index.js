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


const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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


app.get("/", (req,res)=>{
    res.render("home")
})


app.use("/campgrounds", campgrounds)

app.use("/campgrounds/:id/reviews", reviews);

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