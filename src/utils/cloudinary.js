import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ye configuration hi hai jo file upload krne ki permission degi cloudinary pe

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.warn("No local file path provided.");
      return null;
    }

    // Upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfully
    // console.log(response); 

    console.log("file is uploaded on cloudinary", response.secure_url);
    

    // Delete file after successful upload

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return response;

  } catch (error) {

    console.error("Cloudinary upload failed:", error);

    // Safely try to delete the file in case of error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // remove the locally saved temporary file as the upload operation got failed

    return null;
  }
};

export { uploadOnCloudinary };


// agar koi bhi iss method  uploadOnCloudinary ko use kr rha hai toh itna pata hai humein ki file humare server pe toh hai , file path toh aa chuka hai


// for cleaning purpose , uss file ko server se bhi hata dena chahiye wrna server pe malicious files and corrupted file reh jayengi server pe


