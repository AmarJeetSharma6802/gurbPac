import { NextResponse } from "next/server";
import Content from "../../model/content.model";
import { authUser } from "../../middleware/auth.middleware";
import DBconnect from "../../DB/DBconnect";
import { uploadVideoWithPoster } from "@/app/api/utils/cloudinary";
import { generateSlug } from "@/app/api/utils/slug";

export async function POST(req: Request): Promise<Response> {
  try {
    await DBconnect();

    const user = await authUser();

    if (!user) {
      return NextResponse.json({message: "Unauthorized user"},{status: 401,});
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const video = formData.get("video") as File;

    if (!title || !subject || !description || !video) {
      return NextResponse.json({ message: "All fields required",},{status: 400});
    }

    const uploadVideo = await uploadVideoWithPoster(video, "video");


    const slug = generateSlug(title);

    const content = await Content.create({
      teacherId: user._id,
      title,
      subject,
      description,
      videoUrl: uploadVideo.videoUrl,
      posterUrl: uploadVideo.posterUrl,
      status: "pending",
      slug
    });

    return NextResponse.json(
      {
        success: true,
        message: "Video uploaded successfully",
        content,
      },
      {status: 201,},
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {message: "Server Error"},{status: 500});
  }
}


export async function GET(){

  DBconnect()

  const findContent = await Content.find()

   return NextResponse.json({message:"find succefully",findContent},{status:200})
}




