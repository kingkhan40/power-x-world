import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    if (!email || !code)
      return NextResponse.json({ success: false, message: "Email and code required" }, { status: 400 });

    const record = await VerificationCode.findOne({ email, code });
    if (!record)
      return NextResponse.json({ success: false, message: "Invalid or expired code" }, { status: 400 });

    if (record.expiresAt < new Date())
      return NextResponse.json({ success: false, message: "Code expired" }, { status: 400 });

    // Verify user
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Remove used code
    await VerificationCode.deleteOne({ _id: record._id });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      user,
    });
  } catch (err) {
    console.error("Verify Error:", err);
    return NextResponse.json({ success: false, message: "Error verifying user" }, { status: 500 });
  }
}
        