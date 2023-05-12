const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ReviewSchema = new Schema ({
    body:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required:true
    }
})

ReviewSchema.post('findOneAndDelete', function(doc){
    
})

module.exports = mongoose.model("Review", ReviewSchema);