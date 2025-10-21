import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db"; // ✅ named import

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
