const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')


const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const opts = { toJSON: {virtuals: true}}

// arrow function will not work as it will not bind "this" correctly
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
})

ImageSchema.virtual('standardSize').get(function() {
  return this.url.replace('/upload', '/upload/c_fill,w_400,w_600')
})

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);


CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<h4><a href="/campgrounds/${this._id}" >${this.title}</a></h4>
          <p>${this.description.substring(0,100)}...</p>`
});


CampgroundSchema.post("findOneAndDelete", async function(doc){
    if(doc){
      //remove all objects from Review collection where the objects's id is present inside the doc.reviews array
      await Review.deleteMany({
        _id: {
          $in: doc.reviews,
        },
      });
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)