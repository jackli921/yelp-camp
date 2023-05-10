const mongoose = require(mongoose)
const Schema = mongoose.Schema

const ReviewSchema = new Schema ({
    name:{
        type: string,
        required: true
    },
    rating:{
        type: number,
        required:true
    }
})

module.exports = mongoose.model("Review", ReviewSchema);