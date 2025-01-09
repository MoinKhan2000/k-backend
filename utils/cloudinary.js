import '../config/dotenv.config.js'
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApplicationErrorHandler from "./errorHandler.js";

// Set up Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadImageOnCloudinary = async (filePath) => {
  try {
    // Validate that file path is provided
    if (!filePath) {
      throw new ApplicationErrorHandler("Please provide a file path", 400);
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "user-images", // Specify the folder where images are stored
    });

    // Return the secure URL of the uploaded image
    return result.secure_url;

  } catch (error) {
    // Check if the error is specific to Cloudinary or file deletion
    if (error.name === "ApplicationErrorHandler") {
      throw error;  // If a known application error occurs, pass it along
    }

    // Handle Cloudinary upload errors
    if (error.http_code && error.http_code >= 400 && error.http_code < 500) {
      throw new ApplicationErrorHandler(
        `Cloudinary upload failed: ${error.message}`,
        error.http_code
      );
    }

    // Handle file system errors
    if (error.code === 'ENOENT') {
      throw new ApplicationErrorHandler("File not found", 404);
    }

    // Generic server-side error
    throw new ApplicationErrorHandler(error.message || "Error uploading image to Cloudinary", 500);
  } finally {
    // Ensure the temporary file is deleted even if an error occurs
    fs.promises.unlink(filePath);
  }
};
export default uploadImageOnCloudinary
