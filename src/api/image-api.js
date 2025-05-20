import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageApi = {
  upload: {
    auth: false,
    cors: true,
    payload: {
      parse: true,
      output: "stream",
      allow: "multipart/form-data",
      maxBytes: 10 * 1024 * 1024
    },
    handler: async function (request, h) {
      const file = request.payload.file;

      if (!file) {
        return h.response({ error: "No file uploaded" }).code(400);
      }

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ourhospital" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload failed:", error);
              reject(h.response({ error: "Upload failed" }).code(500));
            } else {
              resolve(h.response(result).code(200));
            }
          }
        );
        file.pipe(stream);
      });
    }
  }
};
