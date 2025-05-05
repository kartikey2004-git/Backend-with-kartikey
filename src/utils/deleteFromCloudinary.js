import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async( public_id ) => {

  if (!public_id) {
    console.warn("No avatar public_id provided");
    return null;
  }

  try {
    const response = await cloudinary.uploader.destroy(public_id);

    return response;

  } catch (error) {

    console.error("Error while deleting image from Cloudinary:", error);
    
    return null
  }
}

export default deleteFromCloudinary;