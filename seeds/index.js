const Campground = require('../models/campground')
const mongoose = require("mongoose");
const cities = require("./cities")
const { descriptors , places}= require('./seedHelpers')

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to Mongodb", err);
  }
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 50) + 10
        const camp = new Campground({
          author: "646135dc706536d598ee4713",
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          price: price,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
          images: [
            {
              url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png",
              filename: "default",
            },
            {
              url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png",
              filename: "default",
            },
          ],
          description:
            "Lorem Ipsum is simply dummy text of the printing and tyndard dummy text ever since the 1500s.",
        });

        await camp.save()
    }
}

main()

seedDB().then(()=>{
    mongoose.connection.close
})
