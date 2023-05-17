const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YelpCamp",
    format: async (req, file) => {
      // Extract the file extension from the original filename
      const ext = file.originalname.split(".").pop();

      // Return the file format if it's one of the accepted formats
      if (ext === "png" || ext === "jpg" || ext === "jpeg") {
        return ext;
      }

      // Throw an error if the file format is not supported
      throw new Error(
        "Invalid file format. Only PNG, JPG, and JPEG are allowed."
      );
    },
    public_id: (req, file) => file.originalname
  },
});

module.exports = {cloudinary, storage}