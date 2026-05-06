import { NextResponse } from "next/server";
import Content from "@/app/api/model/content.model";
import DBconnect from "@/app/api/DB/DBconnect";

export async function GET(req: Request,{ params }:any): Promise<Response> {

  await DBconnect();

  const { slug } = await params;

  const content = await Content.findOne({
      slug,
    }).populate("teacherId", "name email");

    if (!content) {
      return NextResponse.json({success: false,message: "Content not found",},{ status: 404 });
    }

    return NextResponse.json({success: true,content,},{ status: 200 });
}