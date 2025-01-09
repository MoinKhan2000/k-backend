import multer from 'multer';

// Configure Multer storage
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: function (req, file, cb) {
    if (!file) return; // Check if file is provided
    cb(null, "./public/temp"); // Specify the folder to save files
  },

  // Define the filename for the uploaded file
  filename: function (req, file, cb) {
    if (!file) return; // Check if file is provided
    // Create a unique filename using timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100);
    cb(null, file.originalname + '-' + uniqueSuffix); // Append unique suffix to original filename
  }
});

// Initialize Multer with the defined storage configuration
const upload = multer({ storage });

export default upload;
