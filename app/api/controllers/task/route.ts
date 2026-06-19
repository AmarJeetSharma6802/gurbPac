import { NextResponse } from "next/server";
import Content from "../../model/content.model";
import Task from "../../model/task.model";
import { authUser } from "../../middleware/auth.middleware";
import DBconnect from "../../DB/DBconnect";
import { uploadMedia } from "../../utils/cloudinary";

export async function POST(req: Request) {
  try {
    await DBconnect();

    const user = await authUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    const contentId = formData.get("contentId") as string;
    const homeworkTitle = formData.get("homeworkTitle") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const totalMarks = Number(formData.get("totalMarks"));

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }

    // Validation
    if (!contentId || !homeworkTitle || !dueDate) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 },
      );
    }

    // 1. findById() se content check karo
    const content = await Content.findById(contentId);

    if (!content) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 },
      );
    }

    // Content ka title
    console.log("Content Title:", content.title);

    const uploadImage = await uploadMedia(image, "tasks");

    const task = await Task.create({
      teacherId: user._id,
      contentId: content._id,

      homeworkTitle,
      description,

      dueDate: new Date(dueDate),
      totalMarks: totalMarks || 0,
      imageUrl: uploadImage.url,

      status: "active",
    });

    // 3. findById + populate dono use karo
    const taskData = await Task.findById(task._id)
      .populate("teacherId", "name email role")
      .populate("contentId", "title subject");

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: taskData,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const totalTasks = await Task.countDocuments();

  const activeTasks = await Task.countDocuments({
    status: "active",
  });

  const expiredTasks = await Task.countDocuments({
    status: "expired",
  });

  const lastTask = await Task.findOne().sort({ dueDate: -1 });

  return NextResponse.json({
    totalTasks,
    activeTasks,
    expiredTasks,
    lastDateOfTask: lastTask?.dueDate,
  });
}
