import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import Reset from "@/models/Reset";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    const generic = { message: "If that email exists, an OTP was sent." };
    if (!user) return NextResponse.json(generic, { status: 200 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

    await Reset.deleteMany({ email });
    await Reset.create({ email, otpHash, expiresAt });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for password reset",
      text: `Your OTP is ${otp}. It expires in 3 minutes.`,
    });

    return NextResponse.json(generic, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
