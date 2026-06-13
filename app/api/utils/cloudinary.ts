import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export interface UploadResponse {
  url: string;
  posterUrl?: string; // sirf video ke liye
  publicId: string;
  type: "image" | "video";
}

export const uploadMedia = async (file: File,folder = "education",): Promise<UploadResponse> => {
  
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    throw new Error("Only image and video files are allowed");
  }

  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  // Image: 5MB, Video: 100MB
  const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${isVideo ? "100MB" : "5MB"}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder,

          ...(isVideo
            ? {
                eager: [
                  {
                    width: 400,
                    height: 300,
                    crop: "fill",
                    format: "jpg",
                  },
                ],
              }
            : {
                transformation: [
                  {
                    width: 800,
                    height: 800,
                    crop: "limit",
                    quality: "auto",
                    fetch_format: "auto",
                  },
                ],
              }),
        },

        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Upload failed"));
          }

          let posterUrl: string | undefined;

          // Video ke liye thumbnail generate karo
          if (isVideo) {
            posterUrl = cloudinary.url(result.public_id, {
              resource_type: "video",
              format: "jpg",
              transformation: [
                {
                  width: 400,
                  height: 300,
                  crop: "fill",
                },
              ],
            });
          }

          resolve({
            url: result.secure_url,
            posterUrl,
            publicId: result.public_id,
            type: isVideo ? "video" : "image",
          });
        },
      )
      .end(buffer);
  });
};
