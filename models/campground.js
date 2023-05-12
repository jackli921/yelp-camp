const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')

const CampgroundSchema = new Schema({
    title:String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }]
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