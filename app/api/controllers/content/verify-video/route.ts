import { NextResponse } from "next/server";
import Content from "@/app/api/model/content.model";
import { authUser } from "@/app/api/middleware/auth.middleware";
import DBconnect from "@/app/api/DB/DBconnect";

export async function PUT(req: Request): Promise<Response> {
  await DBconnect();

  const user = await authUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }

  if (user.role !== "principal") {
    return NextResponse.json(
      { message: "Only principal can approve/reject" },
      { status: 403 },
    );
  }

  try {
    const { contentId, status, rejectionReason } = await req.json();

     const content = await Content.findById(contentId);

      if (!content) {
      return NextResponse.json({ message: "Content not found" },{ status: 404 });
    }


     if (content.status !== "pending") {
      return NextResponse.json({success: false,message: `Content already ${content.status}`,},{ status: 400 });
    }

     if (status === "approved") {
      content.status = "approved";
    }

     if (status === "rejected") {

      if (!rejectionReason) {
        return NextResponse.json(
          {success: false,message: "Rejection reason required",},{ status: 400 });
      }

      content.status = "rejected";
      content.rejectionReason = rejectionReason;

      content.rejectedBy = user._id;
    }

     await content.save();

 return NextResponse.json(
      {success: true,message: `Content ${status} successfully`,content,},{ status: 200 });

  } catch (error) {
        console.log(error);

    return NextResponse.json(
      {success: false,message: "Server Error",},{ status: 500 });
  }

  }


//   const updateContentStatus = async (
//   contId: string,
//   action: "approved" | "rejected",
//   reason?: string
// )
// await fetch("/api/controllers/content/verify-video", {
//   method: "PUT",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     contentId: contId,
//     status: action,
//     rejectionReason: reason,
//   }),
// });