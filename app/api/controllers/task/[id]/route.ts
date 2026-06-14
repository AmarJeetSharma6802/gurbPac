import { NextResponse } from "next/server";
import Content from "../../model/content.model";
import Task from "../../model/task.model";
import { authUser } from "../../middleware/auth.middleware";
import DBconnect from "../../DB/DBconnect";
import { uploadMedia } from "../../utils/cloudinary";