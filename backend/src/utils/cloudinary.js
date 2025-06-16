import dotenv from 'dotenv';
dotenv.config(); 

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // cloud name is the unique name of your cloudinary account
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// console.log("API KEY is : ", process.env.CLOUDINARY_API_KEY);

// console.log("cloudinary config is : ", cloudinary.config()); // 

// console.log("api key is : ", cloudinary.config().api_key);

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("No file path provided for upload.");
        }
        // console.log("Uploading file to Cloudinary from path: ", localFilePath);
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath) // unlink or delete the link to the file in the server synchronously
        return response.url;

    } catch (error) {
        console.error("Error uploading file to Cloudinary: ", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}