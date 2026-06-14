import { NextResponse } from "next/server";
import Content from "../../model/content.model";
import Task from "../../model/task.model";
import { authUser } from "../../middleware/auth.middleware";
import DBconnect from "../../DB/DBconnect";

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

    const {
      contentId,
      homeworkTitle,
      description,
      dueDate,
      totalMarks,
      attachmentUrl,
    } = await req.json();

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

    // 2. Task create karo
    const task = await Task.create({
      teacherId: user._id,
      contentId: content._id,

      homeworkTitle,
      description,

      dueDate: new Date(dueDate),
      totalMarks: totalMarks || 0,
      attachmentUrl,

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


const formData = await req.formdata()
const title = formData.get("")