import cloudinary from "cloudinary";
import path from "path";

const supportedTypes = ["png", "jpeg", "jpg"];

export const uploadImageToCloudinary = async (filePath) => {
  try {
    // Extract file extension
    const fileExt = path.extname(filePath.name).toLowerCase().replace(".", "");

    // Check if the file type is supported
    if (!supportedTypes.includes(fileExt)) {
      return { success: false, message: "Unsupported file type" };
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath.tempFilePath, {
      folder: "gym data", // Optional: specify a Cloudinary folder
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return { success: false, message: "Image upload failed" };
  }
};
