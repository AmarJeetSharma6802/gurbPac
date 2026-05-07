import { NextResponse } from "next/server";
import transporter from "@/app/api/utils/nodmailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import teacher from "../../model/user.model";
import DBconnect from "@/app/api/DB/DBconnect";
import { authUser } from "../../middleware/auth.middleware";

export async function POST(req: Request) {
  try {
    await DBconnect();

    const { name, email, password, otp, action, teacherCode } =
      await req.json();

    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 },
        );
      }

      if (teacherCode !== process.env.TEACHER_SECRET_CODE) {
        return NextResponse.json(
          { message: "Invalid teacher code" },
          { status: 403 },
        );
      }

      const exists = await teacher.findOne({ email });

      if (exists) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 },
        );
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedOtp = await bcrypt.hash(otpCode, 10);

      const userCreate = await teacher.create({
        name,
        email,
        password: hashedPassword,
        role: "teacher",
        emailOtp: hashedOtp,
        emailOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
      });

      await transporter.sendMail({
        to: email,
        subject: "Verify your email",
        html: `
          <h2>Email Verification</h2>
          <h3>Your OTP is: <b>${otpCode}</b></h3>
        `,
      });

      return NextResponse.json(
        {
          message: "Registered successfully. OTP sent",
          next: "verify_otp",
          userCreate,
        },
        {
          status: 201,
        },
      );
    }

    if (action === "verify-otp") {
      if (!email || !otp) {
        return NextResponse.json(
          { message: "Email and OTP required", next: "verify_otp" },
          { status: 400 },
        );
      }
      const user = await teacher.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      if (!user.emailOtp || user.emailOtpExpires! < new Date()) {
        return NextResponse.json(
          { message: "OTP expired or not found" },
          { status: 400 },
        );
      }

      const cleanOtp = otp.trim();

      const isValid = await bcrypt.compare(cleanOtp, user.emailOtp);

      if (!isValid) {
        return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
      }

      const accessToken = jwt.sign(
        { user_id: user._id },
        process.env.ACCESSTOKEN!,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { user_id: user._id },
        process.env.REFRESHTOKEN!,
        { expiresIn: "7d" },
      );

      user.emailOtp = null;
      user.emailOtpExpires = null;

      user.isVerified = true;

      user.refreshToken = refreshToken;

      await user.save();

      const response = NextResponse.json(
        {
          message: "OTP verified. Logged in",
          accessToken,
          refreshToken,
        },
        {
          status: 200,
        },
      );

      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { message: "Email and password required" },
          { status: 400 },
        );
      }

      const user = await teacher.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      if (!user.isVerified) {
        return NextResponse.json(
          { message: "Please verify your email first" },
          { status: 403 },
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 400 },
        );
      }

      const accessToken = jwt.sign(
        { user_id: user._id },
        process.env.ACCESSTOKEN!,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { user_id: user._id },
        process.env.REFRESHTOKEN!,
        { expiresIn: "7d" },
      );

      user.refreshToken = refreshToken;
      await user.save();

      const response = NextResponse.json(
        {
          message: "Login successful",
          accessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            refreshToken,
          },
        },
        { status: 200 },
      );

      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function GET() {
  await DBconnect();

  const user = await authUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }

  return NextResponse.json(
    { message: "user fetch succefully", user },
    { status: 200 },
  );
}
