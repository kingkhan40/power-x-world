// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // ✅ isActive check
    if (user.isActive === false) {
      return NextResponse.json(
        { message: "Account disabled — contact admin" },
        { status: 403 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // ✅ Return all important data for frontend
    return NextResponse.json({
      message: "Login successful",
      token,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/register?ref=${user.referralCode}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
