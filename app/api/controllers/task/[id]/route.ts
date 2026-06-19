import { NextResponse } from "next/server";
import Task from "../../../model/task.model";
import { authUser } from "../../../middleware/auth.middleware";
import DBconnect from "../../../DB/DBconnect";
import { uploadMedia } from "../../../utils/cloudinary";

// export async function PUI(req:Request,{params}:any){
export async function PUI(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
     await DBconnect();

    const user = await authUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 },
      );
    }

    const { id } = params;

    const findTask = await Task.findById(id);

    if (!findTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (
      user.role !== "principal" &&
      findTask.teacherId.toString() !== user._id.toString()
    ) {
      return NextResponse.json(
        { message: "Permission denied" },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const homeworkTitle = formData.get("homeworkTitle") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const totalMarks = Number(formData.get("totalMarks"));

    const image = formData.get("image") as File | null;

    const updateTask: any = {};

    if (homeworkTitle) {
      updateTask.homeworkTitle = homeworkTitle;
    }

    if (description) {
      updateTask.description = description;
    }

    if (dueDate) {
      updateTask.dueDate = new Date(dueDate);

      // Agar future date di gayi hai
      // to task fir se active ho jayega
      
      if (new Date(dueDate) > new Date()) {
        updateTask.status = "active";
      }
    }

    if (!isNaN(totalMarks)) {
      updateTask.totalMarks = totalMarks;
    }

    if (image) {
      const uploadImage = await uploadMedia(image, "tasks");

      updateTask.imageUrl = uploadImage.url;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateTask, {
      new: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request,{ params }: { params: { id: string } },) {

  DBconnect();

  const user = await authUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }

  const { id } = await params;

  const deleteTask = await Task.findByIdAndDelete(id);

  if (!deleteTask) {
    return NextResponse.json({ message: "task not found" }, { status: 401 });
  }
  return NextResponse.json({ message: "task deleted succefully" }, { status: 200 });
}
