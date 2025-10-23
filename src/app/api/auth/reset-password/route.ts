import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import Reset from "@/models/Reset";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const record = await Reset.findOne({ email });
    if (!record) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await Reset.deleteOne({ _id: record._id });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await User.updateOne({ email }, { password: hashed });
    await Reset.deleteOne({ _id: record._id });

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
