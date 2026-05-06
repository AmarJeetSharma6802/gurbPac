import {v2 as cloudinary,UploadApiErrorResponse,UploadApiResponse,} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export interface UploadVideoResponse {
  videoUrl: string;
  posterUrl: string;
  publicId: string;
}

export const uploadVideoWithPoster = async (file: File,folder = "education"): Promise<UploadVideoResponse> => {

  if (!file.type.startsWith("video/")) {
    throw new Error("Only video files are allowed");
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("File size must be less than 100MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadVideoResponse>((resolve, reject) => {

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          folder, 
          eager: [
            { width: 400,height: 300,crop: "fill",format: "jpg",},
          ],
    },
        ( error: UploadApiErrorResponse | undefined,result: UploadApiResponse | undefined ) => {

          if (error) {return reject(error);}

          if (!result) {
            return reject(new Error("Upload failed"));
          }

          const posterUrl = cloudinary.url(result.public_id, {
            resource_type: "video",
            format: "jpg",
            quality: "auto:low",

            transformation: [
              {width: 400,height: 300,crop: "fill",},
            ],
          });

          resolve({
            videoUrl: result.secure_url,
            posterUrl,
            publicId: result.public_id,
          });
        }
      )
      .end(buffer);
  });
};