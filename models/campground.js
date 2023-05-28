const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    location: String,
    description: String
})


const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground