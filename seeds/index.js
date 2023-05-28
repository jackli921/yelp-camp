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
          title: `${sample(descriptors)} ${sample(places)}`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          price: price,
          image:
            "https://source.unsplash.com/collection/9046579/1600x900",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        });

        await camp.save()
    }
}

main()

seedDB().then(()=>{
    mongoose.connection.close
})
