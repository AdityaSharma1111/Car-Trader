import multer from "multer";

// temporarily storing the file in our server before sending it to cloudinary

const storage = multer.diskStorage( // storing in the disk storage
    { 
        destination: function (req, file, cb) { // 'file' is used to store files
            cb(null, "./public/temp")
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname) // originalname as given by the user(not preferred, use filename)
        }
    }
)
  
export const upload = multer({ 
    storage 
})
// Initializes multer with the custom disk storage configuration defined earlier.
// The middleware upload is used in routes to handle file uploads.