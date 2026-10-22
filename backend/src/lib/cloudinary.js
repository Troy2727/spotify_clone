import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Upload an express-fileupload temp file (audio or image) and return its HTTPS URL. */
export async function uploadFile(file) {
	try {
		const { secure_url } = await cloudinary.uploader.upload(file.tempFilePath, { resource_type: "auto" });
		return secure_url;
	} catch (error) {
		console.error("Cloudinary upload failed:", error.message);
		throw new Error("Error uploading to cloudinary");
	}
}
